import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { logger } from "./lib/logger";
import { requestIdMiddleware } from "./lib/requestId";

// Validate required environment variables
function validateEnvVars() {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const required = ["RESEND_API_KEY", "CONTACT_EMAIL"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    if (isDevelopment) {
      // In development, just warn - allow server to start
      logger.warn("Missing environment variables (development mode)", { missing });
      logger.warn("Development Mode: Server will start anyway");
      logger.warn("Note: Contact form submissions will fail without RESEND_API_KEY");
      logger.warn("Copy .env.example to .env and add your keys when ready");
    } else {
      // In production, fail hard
      logger.error("Missing required environment variables", undefined, { missing });
      logger.error(
        "Please create a .env file with these variables. See .env.example for reference."
      );
      process.exit(1);
    }
  }

  // Warn about optional but recommended variables
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    logger.warn("RECAPTCHA_SECRET_KEY not set - reCAPTCHA verification will be skipped");
  }
  if (!process.env.VITE_RECAPTCHA_SITE_KEY) {
    logger.warn("VITE_RECAPTCHA_SITE_KEY not set - reCAPTCHA won't load on frontend");
  }

  if (missing.length === 0) {
    logger.info("Environment variables validated");
  }
}

// Validate environment on startup
validateEnvVars();

// Increase max listeners for development hot reload
process.setMaxListeners(20);

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          // Note: Vite in dev mode requires unsafe-eval and unsafe-inline
          // In production, only external scripts are needed
          process.env.NODE_ENV === "development" ? "'unsafe-inline'" : "",
          process.env.NODE_ENV === "development" ? "'unsafe-eval'" : "",
          "https://www.google.com",
          "https://www.gstatic.com",
          "https://assets.calendly.com",
        ].filter(Boolean),
        styleSrc: [
          "'self'",
          "'unsafe-inline'", // Required for styled-components and Tailwind
          "https://assets.calendly.com",
        ],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: [
          "'self'",
          "https://www.google.com",
          "ws://localhost:*", // Vite HMR in development
          process.env.NODE_ENV === "development" ? "ws:" : "",
        ].filter(Boolean),
        frameSrc: ["https://www.google.com", "https://calendly.com"],
        fontSrc: ["'self'", "data:"],
      },
    },
  })
);

// CORS configuration
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_URL || "https://appturnity.web.app"].filter(Boolean)
    : [
        "http://localhost:7223",
        "http://localhost:5173",
        "http://127.0.0.1:7223",
        "http://127.0.0.1:5173",
      ];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`Blocked CORS request from unauthorized origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for contact form
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 contact form submissions per hour
  message: "Too many contact form submissions, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit for chat widget
const chatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 chat messages per hour
  message: "Too many messages, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));

// Add request ID to all requests
app.use(requestIdMiddleware);

app.use("/api", apiLimiter);
app.use("/api/contact", contactLimiter);
app.use("/api/chat", chatLimiter);

// Log API request durations with structured logging
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      logger.apiRequest(req.method, path, res.statusCode, duration, req.requestId);
    }
  });

  next();
});

// Main server setup
(async () => {
  const server = await registerRoutes(app);

  // Error handling middleware
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log error with structured logging
    logger.error(
      "Request error",
      err,
      {
        status,
        url: req.url,
        method: req.method,
      },
      req.requestId
    );

    res.status(status).json({ message });
  });

  // Setting up Vite only in development mode
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Try to start server on available port
  const preferredPort = 7223;
  const maxPort = 7233; // Try up to port 7233

  function tryListen(port: number) {
    server
      .listen(port, "localhost", () => {
        logger.info(`Server is running on http://localhost:${port}`);
      })
      .on("error", (err: any) => {
        if (err.code === "EADDRINUSE") {
          if (port < maxPort) {
            logger.warn(`Port ${port} is in use, trying ${port + 1}...`);
            tryListen(port + 1);
          } else {
            logger.error(
              `Could not find an available port between ${preferredPort} and ${maxPort}`,
              err,
              { preferredPort, maxPort }
            );
            logger.error("Please close other applications or specify a different port.");
            process.exit(1);
          }
        } else {
          logger.error("Error starting server", err);
          process.exit(1);
        }
      });
  }

  tryListen(preferredPort);
})();

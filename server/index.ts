import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Validate required environment variables
function validateEnvVars() {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const required = ["RESEND_API_KEY", "CONTACT_EMAIL"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    if (isDevelopment) {
      // In development, just warn - allow server to start
      console.warn("⚠️  Missing environment variables (development mode):");
      missing.forEach((key) => console.warn(`   - ${key}`));
      console.warn("\n🔧 Development Mode: Server will start anyway");
      console.warn("📝 Note: Contact form submissions will fail without RESEND_API_KEY");
      console.warn("💡 Copy .env.example to .env and add your keys when ready\n");
    } else {
      // In production, fail hard
      console.error("❌ Missing required environment variables:");
      missing.forEach((key) => console.error(`   - ${key}`));
      console.error("\nPlease create a .env file with these variables.");
      console.error("See .env.example for reference.\n");
      process.exit(1);
    }
  }

  // Warn about optional but recommended variables
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.warn("⚠️  RECAPTCHA_SECRET_KEY not set - reCAPTCHA verification will be skipped");
  }
  if (!process.env.VITE_RECAPTCHA_SITE_KEY) {
    console.warn("⚠️  VITE_RECAPTCHA_SITE_KEY not set - reCAPTCHA won't load on frontend");
  }

  if (missing.length === 0) {
    log("✓ Environment variables validated");
  }
}

// Validate environment on startup
validateEnvVars();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.google.com", "https://www.gstatic.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://www.google.com"],
      frameSrc: ["https://www.google.com"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL || false
    : true, // Allow all origins in development
  credentials: true,
}));

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

app.use("/api", apiLimiter);
app.use("/api/contact", contactLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Log API request durations
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Main server setup
(async () => {
  const server = await registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Setting up Vite only in development mode
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Try to start server on available port
  const preferredPort = 3000;
  const maxPort = 3010; // Try up to port 3010

  function tryListen(port: number) {
    server.listen(port, "localhost", () => {
      log(`Server is running on http://localhost:${port}`);
    }).on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        if (port < maxPort) {
          console.warn(`⚠️  Port ${port} is in use, trying ${port + 1}...`);
          tryListen(port + 1);
        } else {
          console.error(`❌ Could not find an available port between ${preferredPort} and ${maxPort}`);
          console.error(`   Please close other applications or specify a different port.`);
          process.exit(1);
        }
      } else {
        console.error(`❌ Error starting server: ${err.message}`);
        process.exit(1);
      }
    });
  }

  tryListen(preferredPort);
  
})();

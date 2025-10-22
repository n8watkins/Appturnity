import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import {
  sendContactEmail,
  sendChatWidgetEmail,
  sendNewsletterSubscription,
  sendQuizExitModalEmail,
} from "./email";
import { logger } from "./lib/logger";
import { sendErrorNotification } from "./lib/errorNotification";
import {
  ValidationError,
  ExternalServiceError,
  getErrorMessage,
  getErrorStatusCode,
} from "./lib/errors";

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  message: z.string().min(10),
  recaptchaToken: z.string().min(1),
});

const chatWidgetSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1).max(500),
  suggestions: z.array(z.string()).optional(),
  hp_field: z.string().optional(),
  recaptchaToken: z.string().min(1),
});

const newsletterSchema = z.object({
  email: z.string().email(),
  hp_field: z.string().optional(),
  recaptchaToken: z.string().min(1),
});

const quizExitModalSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  quizAnswers: z.record(z.union([z.string(), z.array(z.string())])).optional(),
  recaptchaToken: z.string().min(1),
});

// Function to verify reCAPTCHA token with Google
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RECAPTCHA_SECRET_KEY is required in production");
    }
    logger.warn("RECAPTCHA_SECRET_KEY not configured, skipping verification (DEV ONLY)");
    return true;
  }

  // In development mode, skip reCAPTCHA verification entirely if enabled
  if (process.env.NODE_ENV === "development" && process.env.ALLOW_TEST_RECAPTCHA === "true") {
    logger.debug("Development mode: skipping reCAPTCHA verification");
    return true;
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    // Check if verification was successful and score is above threshold
    // reCAPTCHA v3 returns a score from 0.0 to 1.0
    // 0.5 is a reasonable threshold (higher = more likely human)
    return data.success && data.score >= 0.5;
  } catch (error) {
    logger.error("reCAPTCHA verification error", error as Error);
    return false;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate the request body
      const validatedData = contactFormSchema.parse(req.body);

      // Verify reCAPTCHA token
      const isHuman = await verifyRecaptcha(validatedData.recaptchaToken);

      if (!isHuman) {
        return res.status(400).json({
          success: false,
          message: "reCAPTCHA verification failed. Please try again.",
        });
      }

      // Remove recaptchaToken before sending email
      const { recaptchaToken, ...emailData } = validatedData;

      // Send email notification
      await sendContactEmail(emailData);

      logger.info("Contact form submission sent", { email: validatedData.email }, req.requestId);

      return res.status(200).json({ success: true, message: "Form submitted successfully" });
    } catch (error) {
      // Handle validation errors from Zod
      if (error instanceof z.ZodError) {
        logger.debug("Validation error on contact form", { errors: error.errors }, req.requestId);
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors,
        });
      }

      // Handle custom application errors
      if (error instanceof ValidationError) {
        logger.debug("Validation error", { message: error.message }, req.requestId);
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      if (error instanceof ExternalServiceError) {
        logger.error(
          `External service error: ${error.service}`,
          error,
          { service: error.service },
          req.requestId
        );
        return res.status(error.statusCode).json({
          success: false,
          message: "Service temporarily unavailable. Please try again later.",
        });
      }

      // Log unexpected errors
      logger.error("Error processing contact form", error as Error, undefined, req.requestId);

      return res.status(getErrorStatusCode(error)).json({
        success: false,
        message: "An error occurred while processing your request",
      });
    }
  });

  // Chat widget submission endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      // Validate the request body
      const validatedData = chatWidgetSchema.parse(req.body);

      // Check honeypot field
      if (validatedData.hp_field) {
        return res.status(400).json({
          success: false,
          message: "Spam detected",
        });
      }

      // Verify reCAPTCHA token
      const isHuman = await verifyRecaptcha(validatedData.recaptchaToken);

      if (!isHuman) {
        return res.status(400).json({
          success: false,
          message: "reCAPTCHA verification failed. Please try again.",
        });
      }

      // Remove hp_field and recaptchaToken before sending email
      const { hp_field, recaptchaToken, ...emailData } = validatedData;

      // Send email notification
      await sendChatWidgetEmail(emailData);

      logger.info("Chat widget submission sent", { email: validatedData.email }, req.requestId);

      return res.status(200).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors,
        });
      }

      logger.error("Error processing chat widget", error as Error, undefined, req.requestId);

      return res.status(500).json({
        success: false,
        message: "An error occurred while sending your message",
      });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter", async (req, res) => {
    try {
      // Validate the request body
      const validatedData = newsletterSchema.parse(req.body);

      // Check honeypot field
      if (validatedData.hp_field) {
        return res.status(400).json({
          success: false,
          message: "Spam detected",
        });
      }

      // Verify reCAPTCHA token
      const isHuman = await verifyRecaptcha(validatedData.recaptchaToken);

      if (!isHuman) {
        return res.status(400).json({
          success: false,
          message: "reCAPTCHA verification failed. Please try again.",
        });
      }

      // Remove hp_field and recaptchaToken before sending email
      const { hp_field, recaptchaToken, ...emailData } = validatedData;

      // Send email notification
      await sendNewsletterSubscription(emailData);

      logger.info(
        "Newsletter subscription received",
        { email: validatedData.email },
        req.requestId
      );

      return res
        .status(200)
        .json({ success: true, message: "Successfully subscribed to newsletter" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors,
        });
      }

      logger.error(
        "Error processing newsletter subscription",
        error as Error,
        undefined,
        req.requestId
      );

      return res.status(500).json({
        success: false,
        message: "An error occurred while subscribing to the newsletter",
      });
    }
  });

  // Performance metrics endpoint
  app.post("/api/vitals", (req, res) => {
    try {
      const { name, value, rating, delta, pathname } = req.body;

      logger.info(
        "Web Vital",
        {
          metric: name,
          value: Math.round(value),
          rating,
          delta: Math.round(delta),
          pathname,
        },
        req.requestId
      );

      res.status(200).json({ success: true });
    } catch (error) {
      logger.error("Error processing web vital", error as Error, undefined, req.requestId);
      res.status(500).json({ success: false });
    }
  });

  // Quiz exit modal submission endpoint
  app.post("/api/quiz-exit", async (req, res) => {
    try {
      // Validate the request body
      const validatedData = quizExitModalSchema.parse(req.body);

      // Verify reCAPTCHA token
      const isHuman = await verifyRecaptcha(validatedData.recaptchaToken);

      if (!isHuman) {
        return res.status(400).json({
          success: false,
          message: "reCAPTCHA verification failed. Please try again.",
        });
      }

      // Remove recaptchaToken before sending email
      const { recaptchaToken, ...emailData } = validatedData;

      // Send email notification
      await sendQuizExitModalEmail(emailData);

      logger.info(
        "Quiz exit modal submission received",
        { email: validatedData.email, name: validatedData.name },
        req.requestId
      );

      return res.status(200).json({
        success: true,
        message: "Your request has been received. We'll send your plan within 24 hours!",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors,
        });
      }

      logger.error(
        "Error processing quiz exit modal submission",
        error as Error,
        undefined,
        req.requestId
      );

      return res.status(500).json({
        success: false,
        message: "An error occurred while processing your request",
      });
    }
  });

  // Client error tracking endpoint
  app.post("/api/errors", async (req, res) => {
    try {
      const errorData = req.body;

      // Send error notification (includes logging and email if needed)
      await sendErrorNotification(errorData);

      res.status(200).json({ success: true });
    } catch (error) {
      logger.error(
        "Error processing client error report",
        error as Error,
        undefined,
        req.requestId
      );
      // Still return success so client doesn't retry
      res.status(200).json({ success: false });
    }
  });

  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    const checks: Record<string, string> = {
      server: "ok",
      timestamp: new Date().toISOString(),
    };

    // Check email service
    if (process.env.RESEND_API_KEY) {
      try {
        // Just verify the key exists - actual send test would cost quota
        checks.email = "configured";
      } catch (error) {
        checks.email = "error";
      }
    } else {
      checks.email = "not_configured";
    }

    // Check reCAPTCHA configuration
    if (process.env.RECAPTCHA_SECRET_KEY) {
      checks.recaptcha = "configured";
    } else {
      checks.recaptcha = "not_configured";
    }

    res.json(checks);
  });

  const httpServer = createServer(app);

  return httpServer;
}

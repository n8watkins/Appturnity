"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== "default") __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const http_1 = require("http");
const zod_1 = require("zod");
const email_1 = require("./email");
const functions = __importStar(require("firebase-functions"));
// Get config values from Firebase Functions config or environment variables (for local dev)
const config = functions.config();
const RECAPTCHA_SECRET_KEY =
  ((_a = config.recaptcha) === null || _a === void 0 ? void 0 : _a.secret_key) ||
  process.env.RECAPTCHA_SECRET_KEY;
const contactFormSchema = zod_1.z.object({
  name: zod_1.z.string().min(2),
  email: zod_1.z.string().email(),
  company: zod_1.z.string().optional(),
  message: zod_1.z.string().min(10),
  recaptchaToken: zod_1.z.string().min(1),
});
const chatWidgetSchema = zod_1.z.object({
  name: zod_1.z.string().min(1),
  email: zod_1.z.string().email(),
  message: zod_1.z.string().min(1).max(500),
  suggestions: zod_1.z.array(zod_1.z.string()).optional(),
  hp_field: zod_1.z.string().optional(),
  recaptchaToken: zod_1.z.string().min(1),
});
const newsletterSchema = zod_1.z.object({
  email: zod_1.z.string().email(),
  hp_field: zod_1.z.string().optional(),
  recaptchaToken: zod_1.z.string().min(1),
});
// Function to verify reCAPTCHA token with Google
async function verifyRecaptcha(token) {
  const secretKey = RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.warn("RECAPTCHA_SECRET_KEY not configured, skipping verification");
    return true; // Allow in development if not configured
  }
  // In development mode, allow test tokens for email testing
  if (process.env.NODE_ENV === "development" && token === "test_token") {
    console.log("Development mode: accepting test_token for email testing");
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
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}
async function registerRoutes(app) {
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
      const { recaptchaToken } = validatedData,
        emailData = __rest(validatedData, ["recaptchaToken"]);
      // Send email notification
      await (0, email_1.sendContactEmail)(emailData);
      console.log("Contact form submission sent via email:", validatedData.email);
      return res.status(200).json({ success: true, message: "Form submitted successfully" });
    } catch (error) {
      if (error instanceof zod_1.z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors,
        });
      }
      console.error("Error processing contact form:", error);
      return res.status(500).json({
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
      const { hp_field, recaptchaToken } = validatedData,
        emailData = __rest(validatedData, ["hp_field", "recaptchaToken"]);
      // Send email notification
      await (0, email_1.sendChatWidgetEmail)(emailData);
      console.log("Chat widget submission sent via email:", validatedData.email);
      return res.status(200).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      if (error instanceof zod_1.z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors,
        });
      }
      console.error("Error processing chat widget:", error);
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
      const { hp_field, recaptchaToken } = validatedData,
        emailData = __rest(validatedData, ["hp_field", "recaptchaToken"]);
      // Send email notification
      await (0, email_1.sendNewsletterSubscription)(emailData);
      console.log("Newsletter subscription received:", validatedData.email);
      return res
        .status(200)
        .json({ success: true, message: "Successfully subscribed to newsletter" });
    } catch (error) {
      if (error instanceof zod_1.z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors,
        });
      }
      console.error("Error processing newsletter subscription:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while subscribing to the newsletter",
      });
    }
  });
  const httpServer = (0, http_1.createServer)(app);
  return httpServer;
}
//# sourceMappingURL=routes.js.map

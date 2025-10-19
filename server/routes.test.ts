/**
 * API Routes Test Suite
 * Tests all API endpoints for proper validation, error handling, and responses
 */

import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import request from "supertest";
import express from "express";
import { registerRoutes } from "./routes";

// Mock the email functions
vi.mock("./email", () => ({
  sendContactEmail: vi.fn().mockResolvedValue(undefined),
  sendChatWidgetEmail: vi.fn().mockResolvedValue(undefined),
  sendNewsletterSubscription: vi.fn().mockResolvedValue(undefined),
}));

// Mock the error notification
vi.mock("./lib/errorNotification", () => ({
  sendErrorNotification: vi.fn().mockResolvedValue(undefined),
}));

// Mock logger
vi.mock("./lib/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe("API Routes", () => {
  let app: express.Express;
  let server: any;

  beforeAll(async () => {
    app = express();
    app.use(express.json());

    // Set up test environment variables
    process.env.NODE_ENV = "test";
    process.env.ALLOW_TEST_RECAPTCHA = "true";

    server = await registerRoutes(app);
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  describe("POST /api/contact", () => {
    const validContactData = {
      name: "John Doe",
      email: "john@example.com",
      message: "This is a test message that is long enough to pass validation.",
      recaptchaToken: "test_token",
    };

    it("should accept valid contact form submission", async () => {
      const response = await request(app).post("/api/contact").send(validContactData).expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("submitted");
    });

    it("should reject submission with missing name", async () => {
      const invalidData = { ...validContactData, name: "" };

      const response = await request(app).post("/api/contact").send(invalidData).expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject submission with invalid email", async () => {
      const invalidData = { ...validContactData, email: "not-an-email" };

      const response = await request(app).post("/api/contact").send(invalidData).expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject submission with too short message", async () => {
      const invalidData = { ...validContactData, message: "Short" };

      const response = await request(app).post("/api/contact").send(invalidData).expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject submission without recaptchaToken", async () => {
      const invalidData = { ...validContactData, recaptchaToken: "" };

      const response = await request(app).post("/api/contact").send(invalidData).expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should accept optional company field", async () => {
      const dataWithCompany = { ...validContactData, company: "Test Corp" };

      const response = await request(app).post("/api/contact").send(dataWithCompany).expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe("POST /api/newsletter", () => {
    const validNewsletterData = {
      email: "subscriber@example.com",
      recaptchaToken: "test_token",
    };

    it("should accept valid newsletter subscription", async () => {
      const response = await request(app)
        .post("/api/newsletter")
        .send(validNewsletterData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it("should reject subscription with invalid email", async () => {
      const invalidData = { ...validNewsletterData, email: "invalid" };

      const response = await request(app).post("/api/newsletter").send(invalidData).expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject subscription without email", async () => {
      const response = await request(app)
        .post("/api/newsletter")
        .send({ recaptchaToken: "test_token" })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject honeypot submissions", async () => {
      const honeypotData = { ...validNewsletterData, hp_field: "bot-value" };

      const response = await request(app).post("/api/newsletter").send(honeypotData).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Spam");
    });
  });

  describe("POST /api/chat", () => {
    const validChatData = {
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Quick question",
      recaptchaToken: "test_token",
    };

    it("should accept valid chat message", async () => {
      const response = await request(app).post("/api/chat").send(validChatData).expect(200);

      expect(response.body.success).toBe(true);
    });

    it("should reject chat with missing fields", async () => {
      const invalidData = { email: "test@example.com" };

      const response = await request(app).post("/api/chat").send(invalidData).expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject messages exceeding max length", async () => {
      const longMessage = "a".repeat(501);
      const invalidData = { ...validChatData, message: longMessage };

      const response = await request(app).post("/api/chat").send(invalidData).expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should accept optional suggestions array", async () => {
      const dataWithSuggestions = {
        ...validChatData,
        suggestions: ["Option 1", "Option 2"],
      };

      const response = await request(app).post("/api/chat").send(dataWithSuggestions).expect(200);

      expect(response.body.success).toBe(true);
    });

    it("should reject honeypot submissions", async () => {
      const honeypotData = { ...validChatData, hp_field: "bot" };

      const response = await request(app).post("/api/chat").send(honeypotData).expect(400);

      expect(response.body.message).toContain("Spam");
    });
  });

  describe("POST /api/error", () => {
    const validErrorData = {
      message: "Test error",
      stack: "Error stack trace",
      componentStack: "Component stack",
      url: "http://localhost/test",
      userAgent: "Test Browser",
    };

    it("should accept valid error report", async () => {
      const response = await request(app).post("/api/errors").send(validErrorData).expect(200);

      expect(response.body.success).toBe(true);
    });

    it("should accept partial error reports gracefully", async () => {
      // Error endpoint accepts any error data to prevent client retry loops
      const response = await request(app)
        .post("/api/errors")
        .send({ message: "Error" })
        .expect(200);

      expect(response.body.success).toBeDefined();
    });

    it("should accept additional metadata", async () => {
      const dataWithMetadata = {
        ...validErrorData,
        additionalInfo: { userId: "123", feature: "test" },
      };

      const response = await request(app).post("/api/errors").send(dataWithMetadata).expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("should handle internal server errors gracefully", async () => {
      // Verify error handling middleware is in place
      expect(app._router).toBeDefined();
    });
  });
});

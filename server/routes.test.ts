import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";
import { registerRoutes } from "./routes";
import * as emailModule from "./email";

// Mock the email module
vi.mock("./email", () => ({
  sendContactEmail: vi.fn(),
  sendChatWidgetEmail: vi.fn(),
  sendNewsletterSubscription: vi.fn(),
}));

describe("API Routes", () => {
  let app: express.Application;

  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks();

    // Setup fresh Express app
    app = express();
    app.use(express.json({ limit: "100kb" }));
    app.use(express.urlencoded({ extended: false, limit: "100kb" }));

    await registerRoutes(app);
  });

  describe("POST /api/contact", () => {
    it("successfully submits valid contact form", async () => {
      vi.mocked(emailModule.sendContactEmail).mockResolvedValue({ id: "test-email-id" } as any);

      const response = await request(app).post("/api/contact").send({
        name: "John Doe",
        email: "john@example.com",
        message: "I need a website for my business",
        recaptchaToken: "valid_recaptcha_token",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(emailModule.sendContactEmail).toHaveBeenCalled();
    });

    it("rejects submission with invalid email", async () => {
      const response = await request(app).post("/api/contact").send({
        name: "John Doe",
        email: "invalid-email",
        message: "Test message",
        recaptchaToken: "token",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("rejects submission with short message", async () => {
      const response = await request(app).post("/api/contact").send({
        name: "John Doe",
        email: "john@example.com",
        message: "Short",
        recaptchaToken: "token",
      });

      expect(response.status).toBe(400);
      expect(emailModule.sendContactEmail).not.toHaveBeenCalled();
    });

    it("handles email service errors gracefully", async () => {
      vi.mocked(emailModule.sendContactEmail).mockRejectedValue(
        new Error("Email service unavailable")
      );

      const response = await request(app).post("/api/contact").send({
        name: "John Doe",
        email: "john@example.com",
        message: "Test message here",
        recaptchaToken: "valid_token",
      });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/chat", () => {
    it("successfully submits valid chat message", async () => {
      vi.mocked(emailModule.sendChatWidgetEmail).mockResolvedValue({ id: "chat-id" } as any);

      const response = await request(app).post("/api/chat").send({
        name: "Alice",
        email: "alice@example.com",
        message: "Quick question about pricing",
        recaptchaToken: "valid_token",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(emailModule.sendChatWidgetEmail).toHaveBeenCalled();
    });

    it("rejects chat with honeypot field filled", async () => {
      const response = await request(app).post("/api/chat").send({
        name: "Spammer",
        email: "spam@spam.com",
        message: "Buy my product",
        hp_field: "bot_filled_this",
        recaptchaToken: "valid_token",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Spam detected");
      expect(emailModule.sendChatWidgetEmail).not.toHaveBeenCalled();
    });

    it("rejects chat message longer than 500 characters", async () => {
      const longMessage = "A".repeat(501);

      const response = await request(app).post("/api/chat").send({
        name: "User",
        email: "user@example.com",
        message: longMessage,
        recaptchaToken: "valid_token",
      });

      expect(response.status).toBe(400);
      expect(emailModule.sendChatWidgetEmail).not.toHaveBeenCalled();
    });
  });

  describe("POST /api/newsletter", () => {
    it("successfully subscribes to newsletter", async () => {
      vi.mocked(emailModule.sendNewsletterSubscription).mockResolvedValue({
        id: "newsletter-id",
      } as any);

      const response = await request(app).post("/api/newsletter").send({
        email: "subscriber@example.com",
        recaptchaToken: "valid_token",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(emailModule.sendNewsletterSubscription).toHaveBeenCalled();
    });

    it("rejects subscription with honeypot field filled", async () => {
      const response = await request(app).post("/api/newsletter").send({
        email: "spammer@spam.com",
        hp_field: "bot_detected",
        recaptchaToken: "valid_token",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Spam detected");
      expect(emailModule.sendNewsletterSubscription).not.toHaveBeenCalled();
    });

    it("rejects subscription with invalid email", async () => {
      const response = await request(app).post("/api/newsletter").send({
        email: "invalid",
        recaptchaToken: "valid_token",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("Security Tests", () => {
    it("strips recaptchaToken before sending email", async () => {
      vi.mocked(emailModule.sendContactEmail).mockResolvedValue({ id: "test" } as any);

      await request(app).post("/api/contact").send({
        name: "Test",
        email: "test@example.com",
        message: "Test message",
        recaptchaToken: "secret_token",
      });

      const callArgs = vi.mocked(emailModule.sendContactEmail).mock.calls[0][0];
      expect(callArgs).not.toHaveProperty("recaptchaToken");
    });

    it("handles request with very large payload (100kb limit)", async () => {
      // Express has 100kb limit
      const largeMessage = "A".repeat(100 * 1024);

      const response = await request(app).post("/api/contact").send({
        name: "Test",
        email: "test@example.com",
        message: largeMessage,
        recaptchaToken: "token",
      });

      // Should be rejected by Express body parser
      expect(response.status).toBe(413);
    });
  });
});

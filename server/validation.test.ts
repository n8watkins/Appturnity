import { describe, it, expect } from "vitest";
import { z } from "zod";

// Re-create schemas for testing (extracted from routes.ts)
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

describe("Form Validation Schemas", () => {
  describe("Contact Form Validation", () => {
    it("accepts valid contact form data", () => {
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        message: "I need a website for my business. Looking for something professional.",
        recaptchaToken: "valid_recaptcha_token_here",
      };

      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects invalid email formats", () => {
      const result = contactFormSchema.safeParse({
        name: "John Doe",
        email: "notanemail",
        message: "Test message",
        recaptchaToken: "token",
      });

      expect(result.success).toBe(false);
    });

    it("rejects name shorter than 2 characters", () => {
      const result = contactFormSchema.safeParse({
        name: "J",
        email: "john@example.com",
        message: "Test message here",
        recaptchaToken: "token",
      });

      expect(result.success).toBe(false);
    });

    it("rejects message shorter than 10 characters", () => {
      const result = contactFormSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        message: "Short",
        recaptchaToken: "token",
      });

      expect(result.success).toBe(false);
    });

    it("rejects missing recaptchaToken", () => {
      const result = contactFormSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        message: "I need a website for my business",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("Chat Widget Validation", () => {
    it("accepts valid chat widget data", () => {
      const validData = {
        name: "Alice",
        email: "alice@example.com",
        message: "Quick question about pricing",
        recaptchaToken: "token",
      };

      const result = chatWidgetSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("accepts honeypot field (checked server-side)", () => {
      const dataWithHoneypot = {
        name: "Spammer",
        email: "spam@spam.com",
        message: "Buy my product",
        hp_field: "bot_filled_this",
        recaptchaToken: "token",
      };

      // Schema allows hp_field - server logic handles rejection
      const result = chatWidgetSchema.safeParse(dataWithHoneypot);
      expect(result.success).toBe(true);
    });

    it("rejects message longer than 500 characters", () => {
      const longMessage = "A".repeat(501);

      const result = chatWidgetSchema.safeParse({
        name: "User",
        email: "user@example.com",
        message: longMessage,
        recaptchaToken: "token",
      });

      expect(result.success).toBe(false);
    });

    it("rejects empty name", () => {
      const result = chatWidgetSchema.safeParse({
        name: "",
        email: "user@example.com",
        message: "Test",
        recaptchaToken: "token",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("Newsletter Validation", () => {
    it("accepts valid newsletter subscription", () => {
      const validData = {
        email: "subscriber@example.com",
        recaptchaToken: "token",
      };

      const result = newsletterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("accepts newsletter with honeypot field", () => {
      const dataWithHoneypot = {
        email: "user@example.com",
        hp_field: "bot_value",
        recaptchaToken: "token",
      };

      // Schema allows hp_field - server logic handles rejection
      const result = newsletterSchema.safeParse(dataWithHoneypot);
      expect(result.success).toBe(true);
    });

    it("rejects invalid email", () => {
      const result = newsletterSchema.safeParse({
        email: "not-an-email",
        recaptchaToken: "token",
      });

      expect(result.success).toBe(false);
    });

    it("rejects missing recaptchaToken", () => {
      const result = newsletterSchema.safeParse({
        email: "user@example.com",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("Error Handling", () => {
    it("returns structured Zod validation errors", () => {
      const result = contactFormSchema.safeParse({
        name: "J",
        email: "invalid",
        message: "short",
        recaptchaToken: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toBeInstanceOf(Array);
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });
});

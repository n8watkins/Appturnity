import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { sendContactEmail } from "./email";

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  message: z.string().min(10),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate the request body
      const validatedData = contactFormSchema.parse(req.body);

      // Send email notification
      await sendContactEmail(validatedData);

      console.log("Contact form submission sent via email:", validatedData.email);

      return res.status(200).json({ success: true, message: "Form submitted successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors
        });
      }

      console.error("Error processing contact form:", error);

      return res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

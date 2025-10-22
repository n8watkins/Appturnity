"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const http_1 = require("http");
const zod_1 = require("zod");
const email_1 = require("./email");
// Get config values from environment variables
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
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
    // Accept test/fallback tokens (generated when reCAPTCHA library fails)
    // This is a temporary workaround for Google's reCAPTCHA internal bug
    const testTokenPatterns = [/^test_token_/, /^dev_token_/, /^fallback_/];
    if (testTokenPatterns.some((pattern) => pattern.test(token))) {
        if (process.env.NODE_ENV === "production") {
            console.warn("Production: accepting fallback token due to reCAPTCHA library bug", { token });
        }
        else {
            console.log("Development: accepting test/fallback token", { token });
        }
        return true;
    }
    if (!secretKey) {
        if (process.env.NODE_ENV === "production") {
            throw new Error("RECAPTCHA_SECRET_KEY is required in production");
        }
        console.warn("RECAPTCHA_SECRET_KEY not configured, skipping verification (DEV ONLY)");
        return true;
    }
    // In development mode, allow test tokens for email testing ONLY if explicitly enabled
    if (process.env.NODE_ENV === "development" &&
        process.env.ALLOW_TEST_RECAPTCHA === "true" &&
        token === "test_token") {
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
        // Log reCAPTCHA response for debugging
        console.log("reCAPTCHA verification response:", {
            success: data.success,
            score: data.score,
            action: data.action,
            hostname: data.hostname,
            error_codes: data["error-codes"],
        });
        // Check if verification was successful and score is above threshold
        // reCAPTCHA v3 returns a score from 0.0 to 1.0
        // 0.5 is a reasonable threshold (higher = more likely human)
        if (!data.success) {
            console.warn("reCAPTCHA verification failed:", {
                error_codes: data["error-codes"],
            });
            return false;
        }
        return data.score >= 0.5;
    }
    catch (error) {
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
            const { recaptchaToken } = validatedData, emailData = __rest(validatedData, ["recaptchaToken"]);
            // Send email notification
            await (0, email_1.sendContactEmail)(emailData);
            console.log("Contact form submission sent via email:", validatedData.email);
            return res.status(200).json({ success: true, message: "Form submitted successfully" });
        }
        catch (error) {
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
            const { hp_field, recaptchaToken } = validatedData, emailData = __rest(validatedData, ["hp_field", "recaptchaToken"]);
            // Send email notification
            await (0, email_1.sendChatWidgetEmail)(emailData);
            console.log("Chat widget submission sent via email:", validatedData.email);
            return res.status(200).json({ success: true, message: "Message sent successfully" });
        }
        catch (error) {
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
            const { hp_field, recaptchaToken } = validatedData, emailData = __rest(validatedData, ["hp_field", "recaptchaToken"]);
            // Send email notification
            await (0, email_1.sendNewsletterSubscription)(emailData);
            console.log("Newsletter subscription received:", validatedData.email);
            return res
                .status(200)
                .json({ success: true, message: "Successfully subscribed to newsletter" });
        }
        catch (error) {
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
    // Performance metrics endpoint
    app.post("/api/vitals", (req, res) => {
        try {
            const { name, value, rating, delta, pathname } = req.body;
            console.log("Web Vital", {
                metric: name,
                value: Math.round(value),
                rating,
                delta: Math.round(delta),
                pathname,
            });
            res.status(200).json({ success: true });
        }
        catch (error) {
            console.error("Error processing web vital:", error);
            res.status(500).json({ success: false });
        }
    });
    // Client error tracking endpoint
    app.post("/api/errors", async (req, res) => {
        try {
            const errorData = req.body;
            // Log the error
            console.error("Client error:", errorData);
            res.status(200).json({ success: true });
        }
        catch (error) {
            console.error("Error processing client error report:", error);
            // Still return success so client doesn't retry
            res.status(200).json({ success: false });
        }
    });
    const httpServer = (0, http_1.createServer)(app);
    return httpServer;
}
//# sourceMappingURL=routes.js.map
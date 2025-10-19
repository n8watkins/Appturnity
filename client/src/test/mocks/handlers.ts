/**
 * MSW handlers for mocking API requests in tests
 */

import { http, HttpResponse } from "msw";

export const handlers = [
  // Contact form endpoint
  http.post("/api/contact", async ({ request }) => {
    const body = await request.json();

    // Simulate validation error
    if (!body.email || !body.name || !body.message) {
      return HttpResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Simulate reCAPTCHA failure
    if (body.recaptchaToken === "invalid") {
      return HttpResponse.json({ error: "reCAPTCHA verification failed" }, { status: 400 });
    }

    // Success response
    return HttpResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  }),

  // Newsletter endpoint
  http.post("/api/newsletter", async ({ request }) => {
    const body = await request.json();

    if (!body.email) {
      return HttpResponse.json({ error: "Email is required" }, { status: 400 });
    }

    return HttpResponse.json(
      { success: true, message: "Subscribed successfully" },
      { status: 200 }
    );
  }),

  // Chat widget endpoint
  http.post("/api/chat", async ({ request }) => {
    const body = await request.json();

    if (!body.email || !body.message) {
      return HttpResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    return HttpResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  }),

  // Error tracking endpoint
  http.post("/api/error", async () => {
    return HttpResponse.json({ success: true, message: "Error logged" }, { status: 200 });
  }),
];

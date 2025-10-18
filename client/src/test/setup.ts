import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
} as any;

// Mock reCAPTCHA API for tests
global.fetch = vi.fn((url: string | URL | Request) => {
  const urlString = typeof url === "string" ? url : url.toString();

  // Mock reCAPTCHA verification endpoint
  if (urlString.includes("recaptcha/api/siteverify")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          score: 0.9,
          challenge_ts: new Date().toISOString(),
          hostname: "localhost",
        }),
    } as Response);
  }

  // Default mock for other fetch calls
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  } as Response);
}) as any;

/**
 * Contact Component Test Suite
 * Tests form validation, submission, reCAPTCHA integration, and calculator prefill
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/test/utils";
import Contact from "./Contact";

// Mock useToast hook
const mockToast = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock wouter navigation
const mockSetLocation = vi.fn();
vi.mock("wouter", () => ({
  useLocation: () => ["/", mockSetLocation],
}));

// Mock reCAPTCHA
const mockExecuteRecaptcha = vi.fn();
vi.mock("react-google-recaptcha-v3", () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha: mockExecuteRecaptcha,
  }),
  GoogleReCaptchaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock apiRequest
vi.mock("@/lib/queryClient", () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from "@/lib/queryClient";

describe("Contact Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExecuteRecaptcha.mockResolvedValue("mock-recaptcha-token");
    (apiRequest as any).mockResolvedValue({ success: true });
  });

  it("should render contact form with all fields", () => {
    render(<Contact />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tell us about your project/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("should show validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    });
  });

  it("should show validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "invalid-email");

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it("should show validation error for short message", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/tell us about your project/i);

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(messageInput, "Short");

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it("should submit form with valid data", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/tell us about your project/i);

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(messageInput, "This is a test message that is long enough.");

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockExecuteRecaptcha).toHaveBeenCalledWith("contact_form");
    });

    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith("POST", "/api/contact", {
        name: "John Doe",
        email: "john@example.com",
        message: "This is a test message that is long enough.",
        recaptchaToken: "mock-recaptcha-token",
      });
    });
  });

  it("should redirect to success page after successful submission", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/tell us about your project/i);

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(messageInput, "This is a test message that is long enough.");

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSetLocation).toHaveBeenCalledWith("/success");
    });
  });

  it("should show toast error when submission fails", async () => {
    (apiRequest as any).mockRejectedValue(new Error("Network error"));

    const user = userEvent.setup();
    render(<Contact />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/tell us about your project/i);

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(messageInput, "This is a test message that is long enough.");

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Something went wrong",
        description: "Your message couldn't be sent. Please try again.",
        variant: "destructive",
      });
    });
  });

  it("should show loading state during submission", async () => {
    // Delay the API response
    (apiRequest as any).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    const user = userEvent.setup();
    render(<Contact />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/tell us about your project/i);

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(messageInput, "This is a test message that is long enough.");

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    // Check for loading state
    expect(screen.getByText(/sending/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("should display Calendly button", () => {
    render(<Contact />);

    expect(screen.getByText(/schedule a call instead/i)).toBeInTheDocument();
  });

  it('should display "Why Choose Us" section', () => {
    render(<Contact />);

    expect(screen.getByText(/why clients choose us/i)).toBeInTheDocument();
    expect(screen.getByText(/pay once, own forever/i)).toBeInTheDocument();
    expect(screen.getByText(/built for your workflow/i)).toBeInTheDocument();
    expect(screen.getByText(/rapid development/i)).toBeInTheDocument();
    expect(screen.getByText(/transparent pricing/i)).toBeInTheDocument();
  });

  it("should display contact options in sidebar", () => {
    render(<Contact />);

    expect(screen.getByText(/schedule a free call/i)).toBeInTheDocument();
    expect(screen.getByText(/\(818\) 288-8082/i)).toBeInTheDocument();
    expect(screen.getByText(/send an email/i)).toBeInTheDocument();
  });

  describe("Calculator Integration", () => {
    it("should prefill form when calculator data is dispatched", async () => {
      render(<Contact />);

      // Simulate calculator update event
      const calculatorData = {
        pages: 5,
        selectedFeatures: ["ecommerce", "api"],
        totalPrice: 8000,
        timeline: "4-6 weeks",
      };

      window.dispatchEvent(new CustomEvent("calculatorUpdated", { detail: calculatorData }));

      await waitFor(() => {
        const messageInput = screen.getByLabelText(
          /tell us about your project/i
        ) as HTMLTextAreaElement;
        expect(messageInput.value).toContain("Number of Pages: 5");
        expect(messageInput.value).toContain("E-commerce");
        expect(messageInput.value).toContain("API Integration");
        expect(messageInput.value).toContain("Estimated Investment: $8,000");
      });
    });
  });
});

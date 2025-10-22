import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { safeExecuteRecaptcha, isRecaptchaReady } from "@/lib/recaptchaUtils";

interface NewsletterSignupProps {
  variant?: "default" | "compact" | "inline";
  className?: string;
}

export default function NewsletterSignup({
  variant = "default",
  className = "",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    if (!isRecaptchaReady(executeRecaptcha)) {
      setStatus("error");
      setMessage("reCAPTCHA not ready. Please wait a moment and try again.");
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
      return;
    }

    setStatus("loading");

    try {
      // Execute reCAPTCHA safely - never rejects with null/undefined
      const recaptchaToken = await safeExecuteRecaptcha(
        executeRecaptcha,
        "newsletter_subscription"
      );

      // Call the API endpoint
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          recaptchaToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to subscribe");
      }

      setStatus("success");
      setMessage("🎉 Welcome aboard! You've successfully subscribed to our newsletter.");
      setEmail("");

      // Reset after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    }
  };

  if (variant === "compact") {
    return (
      <div className={cn("bg-white rounded-lg shadow-sm p-6 relative", className)}>
        <div className="flex items-center gap-2 mb-3">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-slate-900">Stay Updated</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Get web development tips and business insights delivered weekly.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            required
            className="text-sm"
          />
          <Button
            type="submit"
            className="w-full"
            disabled={status === "loading" || status === "success"}
          >
            {status === "loading"
              ? "Subscribing..."
              : status === "success"
                ? "Subscribed!"
                : "Subscribe"}
          </Button>
          {message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("text-xs", status === "success" ? "text-green-600" : "text-red-600")}
            >
              {message}
            </motion.p>
          )}
        </form>

        {/* Custom reCAPTCHA v3 notification */}
        <div className="mt-4 text-center opacity-70 select-none">
          <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <span>🛡️</span>
            <span>Protected by reCAPTCHA v3</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="relative">
        <form onSubmit={handleSubmit} className={cn("flex gap-2", className)}>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={status === "loading" || status === "success"}>
            {status === "loading" ? (
              "Subscribing..."
            ) : status === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>

        {/* Custom reCAPTCHA v3 notification */}
        <div className="absolute -bottom-5 right-0 opacity-70 hover:opacity-100 transition-opacity select-none">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>🛡️</span>
            <span>Protected by reCAPTCHA v3</span>
          </div>
        </div>
      </div>
    );
  }

  // Default variant - full featured
  return (
    <motion.div
      className={cn(
        "bg-gradient-to-br from-primary/5 via-blue-50 to-purple-50 rounded-2xl p-8 relative",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex p-3 bg-primary/10 rounded-full mb-4"
        >
          <Mail className="h-8 w-8 text-primary" />
        </motion.div>

        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Join Our Newsletter</h2>

        <p className="text-slate-600 mb-8">
          Get exclusive web development tips, business insights, and updates on saving money with
          custom websites vs expensive SaaS subscriptions. No spam, unsubscribe anytime.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading" || status === "success"}
              required
              className="flex-1 h-12"
            />
            <Button
              type="submit"
              size="lg"
              className="h-12 px-8"
              disabled={status === "loading" || status === "success"}
            >
              {status === "loading" ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Subscribing...
                </span>
              ) : status === "success" ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Subscribed!
                </span>
              ) : (
                "Get Free Tips"
              )}
            </Button>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mt-4 p-3 rounded-lg flex items-center gap-2",
                status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              )}
            >
              {status === "success" ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <span className="text-sm">{message}</span>
            </motion.div>
          )}
        </form>

        <p className="text-xs text-slate-500 mt-6">
          Join 500+ developers and business owners. We respect your privacy.
        </p>
      </div>

      {/* Custom reCAPTCHA v3 notification */}
      <div className="absolute bottom-4 right-4 opacity-70 hover:opacity-100 transition-opacity select-none">
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <span>🛡️</span>
          <span>Protected by reCAPTCHA v3</span>
        </div>
      </div>
    </motion.div>
  );
}

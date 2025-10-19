/**
 * Error Notification System
 *
 * Handles email notifications for client-side errors.
 * Includes rate limiting and error deduplication to prevent spam.
 */

import { logger } from "./logger";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface ErrorData {
  message: string;
  stack?: string;
  type: "error" | "unhandledrejection" | "react";
  severity: "critical" | "error" | "warning";
  url: string;
  pathname: string;
  userAgent: string;
  timestamp: number;
  componentStack?: string;
  errorInfo?: { componentStack?: string };
  context?: Record<string, unknown>;
}

// In-memory error tracking for rate limiting and deduplication
const errorCache = new Map<string, { count: number; lastSeen: number; lastEmailed: number }>();

// Configuration
const CONFIG = {
  // Maximum emails per hour (global)
  MAX_EMAILS_PER_HOUR: 10,
  // Minimum time between emails for the same error (15 minutes)
  MIN_TIME_BETWEEN_SAME_ERROR: 15 * 60 * 1000,
  // Minimum time between any error emails (5 minutes)
  MIN_TIME_BETWEEN_ANY_ERROR: 5 * 60 * 1000,
  // Cache cleanup interval (1 hour)
  CACHE_CLEANUP_INTERVAL: 60 * 60 * 1000,
  // Only email critical and error severity (not warnings)
  EMAIL_SEVERITIES: ["critical", "error"] as const,
};

let emailsSentThisHour = 0;
let lastEmailSent = 0;
let hourResetTime = Date.now() + 60 * 60 * 1000;

// Reset email counter every hour
setInterval(
  () => {
    emailsSentThisHour = 0;
    hourResetTime = Date.now() + 60 * 60 * 1000;
  },
  60 * 60 * 1000
);

// Clean up old error cache entries
setInterval(() => {
  const now = Date.now();
  const oneHourAgo = now - CONFIG.CACHE_CLEANUP_INTERVAL;

  for (const [key, value] of errorCache.entries()) {
    if (value.lastSeen < oneHourAgo) {
      errorCache.delete(key);
    }
  }
}, CONFIG.CACHE_CLEANUP_INTERVAL);

/**
 * Generate error signature for deduplication
 */
function getErrorSignature(error: ErrorData): string {
  // Create a signature based on error message and first line of stack
  const stackFirstLine = error.stack?.split("\n")[0] || "";
  return `${error.type}:${error.message}:${stackFirstLine}`;
}

/**
 * Check if we should send an email for this error
 */
function shouldSendEmail(error: ErrorData): boolean {
  const now = Date.now();

  // Check if severity warrants an email
  if (!CONFIG.EMAIL_SEVERITIES.includes(error.severity as "critical" | "error")) {
    return false;
  }

  // Check global hourly limit
  if (emailsSentThisHour >= CONFIG.MAX_EMAILS_PER_HOUR) {
    logger.warn("Error email rate limit reached (hourly)", {
      emailsSentThisHour,
      limit: CONFIG.MAX_EMAILS_PER_HOUR,
    });
    return false;
  }

  // Check minimum time between any emails
  if (now - lastEmailSent < CONFIG.MIN_TIME_BETWEEN_ANY_ERROR) {
    logger.debug("Error email rate limit (too soon since last email)");
    return false;
  }

  // Check for duplicate errors
  const signature = getErrorSignature(error);
  const cached = errorCache.get(signature);

  if (cached) {
    cached.count++;
    cached.lastSeen = now;

    // Check if enough time has passed since last email for this error
    if (now - cached.lastEmailed < CONFIG.MIN_TIME_BETWEEN_SAME_ERROR) {
      logger.debug("Duplicate error, skipping email", { signature, count: cached.count });
      return false;
    }
  } else {
    // New error
    errorCache.set(signature, {
      count: 1,
      lastSeen: now,
      lastEmailed: 0,
    });
  }

  return true;
}

/**
 * Send error notification email
 */
export async function sendErrorNotification(error: ErrorData): Promise<void> {
  // Log all errors
  logger.error("Client-side error", undefined, {
    type: error.type,
    severity: error.severity,
    message: error.message,
    pathname: error.pathname,
    userAgent: error.userAgent,
  });

  // Check if we should send email
  if (!shouldSendEmail(error)) {
    return;
  }

  // If no Resend API key, just log
  if (!resend) {
    logger.warn("Error email not sent (no RESEND_API_KEY)", {
      severity: error.severity,
      message: error.message,
    });
    return;
  }

  const signature = getErrorSignature(error);
  const cached = errorCache.get(signature);
  const occurrenceCount = cached?.count || 1;

  // Update cache
  if (cached) {
    cached.lastEmailed = Date.now();
  }

  // Update rate limiting counters
  emailsSentThisHour++;
  lastEmailSent = Date.now();

  // Prepare email
  const severityEmoji = {
    critical: "🔥",
    error: "❌",
    warning: "⚠️",
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: ${error.severity === "critical" ? "#dc2626" : "#ef4444"};
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background: #f9fafb;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          .field {
            margin-bottom: 15px;
          }
          .label {
            font-weight: 600;
            color: #374151;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .value {
            background: white;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #e5e7eb;
            margin-top: 5px;
            word-break: break-word;
          }
          .stack {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            white-space: pre-wrap;
            max-height: 300px;
            overflow-y: auto;
          }
          .footer {
            background: #1f2937;
            color: #9ca3af;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            border-radius: 0 0 8px 8px;
          }
          .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 10px;
          }
          .badge-critical {
            background: #fef3c7;
            color: #92400e;
          }
          .badge-error {
            background: #fee2e2;
            color: #991b1b;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; font-size: 20px;">
            ${severityEmoji[error.severity]} ${error.severity.toUpperCase()} Error on Appturnity
          </h1>
          ${occurrenceCount > 1 ? `<div class="badge badge-${error.severity}">Occurred ${occurrenceCount} times</div>` : ""}
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Error Type</div>
            <div class="value">${error.type}</div>
          </div>
          <div class="field">
            <div class="label">Message</div>
            <div class="value">${error.message}</div>
          </div>
          <div class="field">
            <div class="label">Page</div>
            <div class="value">${error.pathname}</div>
          </div>
          <div class="field">
            <div class="label">Full URL</div>
            <div class="value" style="font-size: 12px;">${error.url}</div>
          </div>
          ${
            error.stack
              ? `
          <div class="field">
            <div class="label">Stack Trace</div>
            <div class="value stack">${error.stack}</div>
          </div>
          `
              : ""
          }
          ${
            error.componentStack
              ? `
          <div class="field">
            <div class="label">Component Stack</div>
            <div class="value stack">${error.componentStack}</div>
          </div>
          `
              : ""
          }
          <div class="field">
            <div class="label">Browser</div>
            <div class="value" style="font-size: 12px;">${error.userAgent}</div>
          </div>
          <div class="field">
            <div class="label">Timestamp</div>
            <div class="value">${new Date(error.timestamp).toLocaleString()}</div>
          </div>
          ${
            error.context
              ? `
          <div class="field">
            <div class="label">Additional Context</div>
            <div class="value"><pre style="margin: 0; font-size: 11px;">${JSON.stringify(error.context, null, 2)}</pre></div>
          </div>
          `
              : ""
          }
        </div>
        <div class="footer">
          Appturnity Error Monitoring
        </div>
      </body>
    </html>
  `;

  const textContent = `
${severityEmoji[error.severity]} ${error.severity.toUpperCase()} Error on Appturnity
${occurrenceCount > 1 ? `Occurred ${occurrenceCount} times\n` : ""}
==================================================

Error Type: ${error.type}
Message: ${error.message}
Page: ${error.pathname}
URL: ${error.url}
Timestamp: ${new Date(error.timestamp).toLocaleString()}

${error.stack ? `Stack Trace:\n${error.stack}\n\n` : ""}
${error.componentStack ? `Component Stack:\n${error.componentStack}\n\n` : ""}

Browser: ${error.userAgent}

${error.context ? `\nAdditional Context:\n${JSON.stringify(error.context, null, 2)}` : ""}
  `.trim();

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Appturnity Errors <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL || "nathancwatkins23@gmail.com",
      subject: `${severityEmoji[error.severity]} ${error.severity.toUpperCase()}: ${error.message.substring(0, 50)}${error.message.length > 50 ? "..." : ""}`,
      html: htmlContent,
      text: textContent,
    });

    logger.info("Error notification email sent", {
      severity: error.severity,
      type: error.type,
      occurrenceCount,
    });
  } catch (emailError) {
    logger.error("Failed to send error notification email", emailError as Error);
  }
}

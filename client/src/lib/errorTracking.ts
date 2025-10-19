/**
 * DIY Error Tracking System
 *
 * Captures JavaScript errors, unhandled promise rejections, and React errors.
 * Sends them to backend for logging and email notifications.
 * Includes client-side rate limiting to prevent spam attacks.
 */

// Rate limiting configuration
const MAX_ERRORS_PER_MINUTE = 5;
let errorsSentInLastMinute = 0;
let lastErrorResetTime = Date.now();

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
  // Additional context
  context?: Record<string, unknown>;
}

/**
 * Determine error severity based on error details
 */
function getErrorSeverity(error: Error | unknown, type: string): "critical" | "error" | "warning" {
  const errorMessage = error?.message || String(error);
  const errorStack = error?.stack || "";

  // Critical errors - immediate attention needed
  const criticalPatterns = [
    /payment/i,
    /checkout/i,
    /transaction/i,
    /database/i,
    /auth/i,
    /login/i,
    /security/i,
    /permission/i,
    /network.*failed/i,
  ];

  if (criticalPatterns.some((pattern) => pattern.test(errorMessage) || pattern.test(errorStack))) {
    return "critical";
  }

  // React errors are usually important
  if (type === "react") {
    return "error";
  }

  // Warnings - low priority
  const warningPatterns = [/deprecated/i, /warning/i, /console/i];

  if (warningPatterns.some((pattern) => pattern.test(errorMessage))) {
    return "warning";
  }

  return "error";
}

/**
 * Get browser and device information
 */
function getBrowserInfo() {
  if (typeof window === "undefined") return {};

  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    online: navigator.onLine,
  };
}

/**
 * Check if we should send an error (rate limiting)
 */
function shouldSendError(): boolean {
  const now = Date.now();

  // Reset counter every minute
  if (now - lastErrorResetTime > 60000) {
    errorsSentInLastMinute = 0;
    lastErrorResetTime = now;
  }

  // Check rate limit
  if (errorsSentInLastMinute >= MAX_ERRORS_PER_MINUTE) {
    console.debug(`Error tracking rate limit reached (${MAX_ERRORS_PER_MINUTE}/min)`);
    return false;
  }

  return true;
}

/**
 * Send error to backend
 */
async function sendErrorToBackend(errorData: ErrorData) {
  // Check rate limit before sending
  if (!shouldSendError()) {
    return;
  }

  errorsSentInLastMinute++;

  try {
    await fetch("/api/errors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(errorData),
      keepalive: true,
    }).catch(() => {
      // Fail silently - don't create infinite error loops
    });
  } catch (error) {
    // Silently fail
    console.debug("Failed to send error to backend:", error);
  }
}

/**
 * Track JavaScript errors
 */
function handleError(event: ErrorEvent) {
  const errorData: ErrorData = {
    message: event.message,
    stack: event.error?.stack,
    type: "error",
    severity: getErrorSeverity(event.error, "error"),
    url: window.location.href,
    pathname: window.location.pathname,
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
    context: {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      ...getBrowserInfo(),
    },
  };

  sendErrorToBackend(errorData);
}

/**
 * Track unhandled promise rejections
 */
function handleUnhandledRejection(event: PromiseRejectionEvent) {
  const reason = event.reason;
  const errorData: ErrorData = {
    message: reason?.message || "Unhandled Promise Rejection",
    stack: reason?.stack,
    type: "unhandledrejection",
    severity: getErrorSeverity(reason, "unhandledrejection"),
    url: window.location.href,
    pathname: window.location.pathname,
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
    context: {
      reason: String(reason),
      ...getBrowserInfo(),
    },
  };

  sendErrorToBackend(errorData);
}

/**
 * Track React errors (called from ErrorBoundary)
 */
export function trackReactError(error: Error, errorInfo: { componentStack?: string }) {
  const errorData: ErrorData = {
    message: error.message,
    stack: error.stack,
    type: "react",
    severity: getErrorSeverity(error, "react"),
    url: window.location.href,
    pathname: window.location.pathname,
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
    componentStack: errorInfo.componentStack,
    errorInfo,
    context: getBrowserInfo(),
  };

  sendErrorToBackend(errorData);
}

/**
 * Initialize error tracking
 * Call this once when the app loads
 */
export function initErrorTracking() {
  // Only run in browser
  if (typeof window === "undefined") return;

  // Track JavaScript errors
  window.addEventListener("error", handleError);

  // Track unhandled promise rejections
  window.addEventListener("unhandledrejection", handleUnhandledRejection);

  console.debug("Error tracking initialized");
}

/**
 * Manually track an error with custom context
 */
export function trackError(error: Error | string, context?: Record<string, unknown>) {
  const errorObj = typeof error === "string" ? new Error(error) : error;

  const errorData: ErrorData = {
    message: errorObj.message,
    stack: errorObj.stack,
    type: "error",
    severity: "error",
    url: window.location.href,
    pathname: window.location.pathname,
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
    context: {
      ...context,
      ...getBrowserInfo(),
    },
  };

  sendErrorToBackend(errorData);
}

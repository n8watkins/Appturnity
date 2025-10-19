/**
 * Custom Error Classes for Improved Error Handling
 *
 * Provides specific error types for different failure scenarios,
 * enabling better error handling, logging, and user feedback.
 */

/**
 * Base Application Error
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error (400)
 * For invalid input data
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public details?: any
  ) {
    super(message, 400, true);
  }
}

/**
 * Authentication Error (401)
 * For authentication failures
 */
export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401, true);
  }
}

/**
 * Authorization Error (403)
 * For permission/access denied
 */
export class AuthorizationError extends AppError {
  constructor(message: string = "Access denied") {
    super(message, 403, true);
  }
}

/**
 * Not Found Error (404)
 * For missing resources
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, true);
  }
}

/**
 * Rate Limit Error (429)
 * For rate limiting violations
 */
export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests, please try again later") {
    super(message, 429, true);
  }
}

/**
 * External Service Error (502)
 * For third-party service failures (e.g., email, reCAPTCHA)
 */
export class ExternalServiceError extends AppError {
  constructor(
    public service: string,
    message: string = "External service unavailable",
    public originalError?: Error
  ) {
    super(message, 502, true);
  }
}

/**
 * Database Error (500)
 * For database-related failures
 */
export class DatabaseError extends AppError {
  constructor(
    message: string,
    public originalError?: Error
  ) {
    super(message, 500, false); // Not operational - indicates system issue
  }
}

/**
 * Check if error is an operational error (expected, handled)
 * vs programming error (bug, unhandled)
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

/**
 * Extract error message safely
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unknown error occurred";
}

/**
 * Extract error status code
 */
export function getErrorStatusCode(error: unknown): number {
  if (error instanceof AppError) {
    return error.statusCode;
  }
  return 500;
}

/**
 * Request ID Middleware
 *
 * Generates unique IDs for each request to enable request tracing across logs.
 */

import type { Request, Response, NextFunction } from "express";
import { randomBytes } from "crypto";

// Extend Express Request type to include requestId
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

/**
 * Generate a short unique request ID
 */
function generateRequestId(): string {
  return randomBytes(8).toString("hex");
}

/**
 * Middleware to add request ID to each request
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  // Use existing request ID from header, or generate new one
  const requestId = (req.headers["x-request-id"] as string) || generateRequestId();

  // Attach to request object
  req.requestId = requestId;

  // Add to response headers for client tracing
  res.setHeader("X-Request-ID", requestId);

  next();
}

/**
 * Structured Logging Utility
 *
 * Provides consistent logging with levels, timestamps, and metadata.
 * Simple implementation without external dependencies.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogMetadata {
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: LogMetadata;
  requestId?: string;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== "production";
  }

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, metadata, requestId } = entry;

    // In production, use JSON format for log aggregation tools
    if (!this.isDevelopment) {
      return JSON.stringify({ timestamp, level, message, metadata, requestId });
    }

    // In development, use human-readable format
    const levelEmoji = {
      debug: "🔍",
      info: "ℹ️ ",
      warn: "⚠️ ",
      error: "❌",
    };

    let output = `${levelEmoji[level]} ${message}`;

    if (requestId) {
      output += ` [reqId: ${requestId}]`;
    }

    // Add timestamp at the end for less clutter
    output += ` [${timestamp}]`;

    if (metadata && Object.keys(metadata).length > 0) {
      output += `\n${JSON.stringify(metadata, null, 2)}`;
    }

    return output;
  }

  private log(level: LogLevel, message: string, metadata?: LogMetadata, requestId?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
      requestId,
    };

    const formattedLog = this.formatLog(entry);

    switch (level) {
      case "debug":
        if (this.isDevelopment) {
          console.debug(formattedLog);
        }
        break;
      case "info":
        console.info(formattedLog);
        break;
      case "warn":
        console.warn(formattedLog);
        break;
      case "error":
        console.error(formattedLog);
        break;
    }
  }

  debug(message: string, metadata?: LogMetadata, requestId?: string) {
    this.log("debug", message, metadata, requestId);
  }

  info(message: string, metadata?: LogMetadata, requestId?: string) {
    this.log("info", message, metadata, requestId);
  }

  warn(message: string, metadata?: LogMetadata, requestId?: string) {
    this.log("warn", message, metadata, requestId);
  }

  error(message: string, error?: Error | unknown, metadata?: LogMetadata, requestId?: string) {
    const errorMetadata = {
      ...metadata,
      error: error
        ? {
            message: error.message,
            stack: this.isDevelopment ? error.stack : undefined,
            name: error.name,
            ...error,
          }
        : undefined,
    };

    this.log("error", message, errorMetadata, requestId);
  }

  /**
   * Log API request
   */
  apiRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    requestId?: string
  ) {
    const level = statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";

    this.log(level, `${method} ${path} ${statusCode} in ${duration}ms`, undefined, requestId);
  }
}

// Export singleton instance
export const logger = new Logger();

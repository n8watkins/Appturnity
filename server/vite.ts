import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import { logger } from "./lib/logger";

const viteLogger = createLogger();

// Export the log function
export function log(message: string, source = "express") {
  logger.info(message, { source });
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: ["localhost"], // Fixed this to be an array instead of a boolean
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        // Log the error but DON'T exit - let the dev server continue running
        // This allows HMR to recover from errors instead of crashing
        viteLogger.error(msg, options);
        logger.error("Vite error (non-fatal)", new Error(msg as string));
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  // Track if cleanup has been called to prevent multiple executions
  let cleanupCalled = false;

  // Clean up Vite server on process termination
  const cleanup = async () => {
    if (cleanupCalled) return;
    cleanupCalled = true;

    logger.info("Shutting down Vite server gracefully...");
    try {
      await vite.close();
      logger.info("Vite server closed successfully");
    } catch (err) {
      logger.error("Error closing Vite server", err as Error);
    }
  };

  // Use 'once' instead of 'on' to prevent multiple cleanup calls
  process.once("SIGTERM", async () => {
    await cleanup();
    process.exit(0);
  });
  process.once("SIGINT", async () => {
    await cleanup();
    process.exit(0);
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(import.meta.dirname, "..", "client", "index.html");

      // always reload the index.html file from disk in case it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(`src="/src/main.tsx"`, `src="/src/main.tsx?v=${nanoid()}"`);
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // Fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = 3000; // Using port 3000 for Next.js
const expressPort = 5000; // Express will run on port 5000 as required by Replit

// Initialize Next.js
const nextApp = next({ dev, hostname, port });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  // Start the Next.js server
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling Next.js request', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
  .once('error', (err) => {
    console.error('Next.js server error:', err);
    process.exit(1);
  })
  .listen(port, hostname, () => {
    console.log(`> Next.js ready on http://${hostname}:${port}`);
    
    // Create an Express server that proxies to Next.js
    const expressApp = express();
    
    // Proxy all requests to the Next.js server
    expressApp.use('/', createProxyMiddleware({
      target: `http://${hostname}:${port}`,
      changeOrigin: true,
      ws: true,
    }));
    
    // Start Express server on Replit's required port
    expressApp.listen(expressPort, hostname, () => {
      console.log(`> Express proxy ready on http://${hostname}:${expressPort}`);
    });
  });
});
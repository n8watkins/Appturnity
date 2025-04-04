import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Configuration
const hostname = '0.0.0.0';
const nextPort = 3000; // Next.js is running on port 3000
const expressPort = 5000; // Express proxy runs on port 5000 (required by Replit)

// Create Express server for proxying
const app = express();

// Configure proxy middleware
const proxyOptions = {
  target: `http://${hostname}:${nextPort}`,
  changeOrigin: true,
  ws: true, // Support WebSocket connections
  logLevel: 'debug',
  pathRewrite: { '^/': '/' }
};

// Create the proxy middleware instance
const proxy = createProxyMiddleware(proxyOptions);

// Use the proxy for all routes - this will forward everything to Next.js
app.use('/', proxy);

// Start Express server on Replit's required port with error handling
const server = app.listen(expressPort, hostname, () => {
  console.log(`> Express proxy ready on http://${hostname}:${expressPort}`);
  console.log(`> Proxying to Next.js on http://${hostname}:${nextPort}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`> Port ${expressPort} is already in use.`);
    console.log('> The Next.js server is still running on port 3000.');
    console.log(`> You can access it through the existing proxy at http://${hostname}:${expressPort}`);
  } else {
    console.error('Server error:', err);
  }
});
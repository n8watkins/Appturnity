#!/bin/bash

# Set environment variables for development
export NODE_ENV=development
export NODE_OPTIONS="--experimental-modules"

# Kill any running Express or Next.js processes
echo "Checking for existing server processes..."
pkill -f "node server/index.ts" || true
pkill -f "tsx server/index.ts" || true
pkill -f "next dev" || true
pkill -f "node server-next.js" || true
sleep 1

# Start Next.js in development mode on port 3001 (background)
echo "Starting Next.js development server on port 3001..."
npx next dev -p 3001 &
NEXT_PID=$!

# Wait for Next.js to initialize
echo "Waiting for Next.js to initialize..."
sleep 10

# Start Express proxy which runs on port 5001 (changed to avoid conflict)
echo "Starting Express proxy server on port 5001..."
node server-next.js &
PROXY_PID=$!

# Set up trap to handle script termination
trap 'echo "Cleaning up processes..."; kill $NEXT_PID $PROXY_PID 2>/dev/null || true; exit' SIGINT SIGTERM EXIT

# Keep the script running
echo "Both servers are now running:"
echo "- Next.js on port 3001"
echo "- Express proxy on port 5001"
echo "- Main Express on port 5000"
echo "Press Ctrl+C to stop the Next.js servers."
wait

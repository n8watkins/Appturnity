#!/bin/bash

# Make sure we have a build
if [ ! -d ".next" ]; then
  echo "No .next directory found. Running build first..."
  ./build-next.sh
fi

# Set environment variables for production
export NODE_ENV=production
export NODE_OPTIONS="--experimental-modules"

# Start Next.js server in production mode (background)
echo "Starting Next.js production server..."
npx next start -p 3000 &
NEXT_PID=$!

# Wait a moment for Next.js to initialize
sleep 2

# Start Express proxy for production
echo "Starting Express proxy for Next.js..."
NODE_ENV=production NODE_OPTIONS="--experimental-modules" node server-next.js

# Clean up on exit
kill $NEXT_PID

#!/bin/bash

# Stop any running Express server
pkill -f "tsx server/index.ts" || true

# Start Next.js server
echo "Starting Next.js server..."
NODE_OPTIONS="--experimental-modules" node server-next.js

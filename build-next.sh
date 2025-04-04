#!/bin/bash

# Clean up any existing .next directory
rm -rf .next

# Create .next directory structure
mkdir -p .next/server

# Set environment variables for build
export NODE_ENV=production
export NODE_OPTIONS="--experimental-modules"

# Run Next.js build
echo "Building Next.js application..."
npx next build

echo "Next.js build completed. Check the .next directory for build output."

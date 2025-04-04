#!/bin/bash

echo "Stopping any running Node.js processes..."
pkill -f node || true
pkill -f next || true
pkill -f "tsx server/index.ts" || true

echo "Waiting for processes to terminate..."
sleep 3

echo "Starting Next.js application..."
./run-next.sh

#!/bin/bash

# Exit on error
set -e

# Remove any existing package-lock.json
echo "Removing existing package-lock.json..."
rm -f package-lock.json

# Clean install dependencies to generate a fresh package-lock.json
echo "Reinstalling dependencies..."
npm ci || npm install

# Build the Next.js application
echo "Building Next.js application..."
npm run build

echo "✅ Build complete and package-lock.json regenerated!"

#!/bin/bash

# Exit on error
set -e

# Remove any existing package-lock.json
echo "Removing existing package-lock.json..."
rm -f package-lock.json

# Clean install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Build the Next.js application with export
echo "Building Next.js application with static export..."
npm run build

# Test the build output
echo "Build complete! Output is in the .next directory"
echo "Ready for deployment to Netlify"

# Instructions for manual deployment
echo ""
echo "To deploy manually to Netlify, run:"
echo "  netlify deploy --prod"
echo ""
echo "For automatic deployments, connect this repository to Netlify and configure:"
echo "  - Build command: npm run build"
echo "  - Publish directory: .next"
echo "  - Node.js version: 20.11.1"

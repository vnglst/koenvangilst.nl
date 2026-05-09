#!/bin/sh
set -e

# Fix permissions for mounted volume (running as root initially)
if [ -d "/app/public/static/photography-optimized" ]; then
  chown -R appuser:nodejs /app/public/static/photography-optimized
fi

# Generate optimized images before starting the server
# This ensures all photos are pre-generated on first deploy (idempotent)
echo "Running image generation..."
su-exec appuser:nodejs node /app/scripts/generate-images.mjs

# Switch to appuser and execute the main command
exec su-exec appuser:nodejs "$@"

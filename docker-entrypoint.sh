#!/bin/sh
set -e

# Fix permissions for mounted volume (running as root)
if [ -d "/app/public/static/photography-optimized" ]; then
  chown -R nextjs:nodejs /app/public/static/photography-optimized
fi

# Generate optimized images before starting the server (runs as nextjs user)
# This ensures all photos are pre-generated on first deploy
echo "Running image generation..."
su-exec nextjs:nodejs node /app/scripts/generate-images.mjs

# Switch to nextjs user and execute the main command
exec su-exec nextjs:nodejs "$@"

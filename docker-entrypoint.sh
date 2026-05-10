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

# Pre-generate photo metadata JSON (EXIF, srcSet, blur placeholders)
# This makes the photography page load instantly instead of processing at runtime
echo "Generating photo metadata..."
su-exec appuser:nodejs node /app/scripts/generate-photos-data.mjs

# Switch to appuser and execute the main command
exec su-exec appuser:nodejs "$@"

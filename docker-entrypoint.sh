#!/bin/sh
set -e

# Fix permissions for mounted photography-optimized volume (container starts as root)
if [ -d "/app/public/static/photography-optimized" ]; then
  chown -R appuser:nodejs /app/public/static/photography-optimized
fi

# Generate optimized images (idempotent — skips files that already exist)
echo "Running image generation..."
su-exec appuser:nodejs node /app/scripts/generate-images.mjs

# Generate photo metadata JSON (EXIF, srcSet, blur placeholders)
echo "Generating photo metadata..."
su-exec appuser:nodejs node /app/scripts/generate-photos-data.mjs

# Start Node.js SSR server in background (localhost:3001 — internal only)
echo "Starting Node.js SSR server on 127.0.0.1:3001..."
su-exec appuser:nodejs node_modules/.bin/srvx --entry server/server.js &

# Start Nginx in foreground as the main process (becomes effective PID 1)
echo "Starting Nginx on 0.0.0.0:3000..."
exec nginx -g "daemon off;"

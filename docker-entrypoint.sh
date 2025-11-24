#!/bin/sh
set -e

# Fix permissions for mounted volume (running as root)
if [ -d "/app/public/static/photography-optimized" ]; then
  chown -R nextjs:nodejs /app/public/static/photography-optimized
fi

# Switch to nextjs user and execute the main command
exec su-exec nextjs:nodejs "$@"

#!/bin/sh
set -e

# Start Node.js SSR server in background (localhost:3001 — internal only).
# PORT and HOSTNAME are set inline to override any env vars injected by the
# container platform (e.g. Coolify sets PORT=3000 at runtime).
echo "Starting Node.js SSR server on 127.0.0.1:3001..."
su-exec appuser:nodejs env PORT=3001 HOSTNAME=127.0.0.1 node_modules/.bin/srvx --entry server/server.js &

# Start Nginx in foreground as the main process (becomes effective PID 1)
echo "Starting Nginx on 0.0.0.0:80..."
exec nginx -g "daemon off;"

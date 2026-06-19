#!/bin/sh
# Zipline photo sync - invoked by cron every N minutes.
# Env vars are passed through from the container environment (set in Coolify).

cd /app
node sync.mjs >> /app/data/sync.log 2>&1

if [ $? -ne 0 ]; then
  echo "[$(date)] sync failed" >> /app/data/sync.log
fi

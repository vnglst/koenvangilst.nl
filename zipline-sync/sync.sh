#!/bin/sh
# Zipline photo sync - invoked by cron every N minutes.
# Env vars are passed through from the container environment (set in Coolify).

cd /app
node sync.mjs 

if [ $? -ne 0 ]; then
  echo "[$(date)] sync failed" 
fi

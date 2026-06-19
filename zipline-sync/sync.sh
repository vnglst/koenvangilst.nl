#!/bin/sh
# Zipline photo sync - invoked by cron every N minutes.
# Env vars are passed through from the container environment (set in Coolify).

set -eu

lockdir=/tmp/zipline-sync.lock

mkdir "$lockdir" 2>/dev/null || exit 0
trap 'rmdir "$lockdir"' EXIT INT TERM

cd /app
status=0
if node sync.mjs; then
  :
else
  status=$?
fi

if [ "$status" -ne 0 ]; then
  echo "[$(date)] sync failed"
fi

exit "$status"

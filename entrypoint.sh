#!/bin/sh
set -e
ORDINAL=$(echo "$POD_NAME" | awk -F'-' '{print $NF+1}' 2>/dev/null)
ORDINAL=${ORDINAL:-1}
WORKER_ID="worker-$ORDINAL"
echo "Assigned WORKER_ID=$WORKER_ID"

npx prisma migrate deploy
node dist/src/index.js

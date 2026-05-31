#!/bin/sh
set -e

if [ "$SEED_DATABASE" = "true" ]; then
  echo "Running database seed..."
  node dist/database/seed.js
fi

exec node dist/main

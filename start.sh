#!/bin/sh

# Ensure DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is not set."
  exit 1
fi

# Run Prisma migration at runtime
npx prisma migrate deploy

# Start the application
exec node dist/src/main.js

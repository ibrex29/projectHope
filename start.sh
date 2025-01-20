#!/bin/sh

# Run Prisma migration at runtime
npx prisma migrate deploy

# Start the application
exec node dist/src/main.js

#!/bin/sh

# Run database migrations (optional)
echo "Running database migrations..."
yarn prisma migrate deploy

# Seed the database
echo "Seeding the database..."
yarn seed

# Start the application
echo "Starting the application..."
yarn start
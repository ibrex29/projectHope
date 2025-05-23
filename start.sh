#!/bin/sh

# Reset the database (for development only)
# echo "Resetting the database..."
# yarn prisma migrate reset --force --skip-seed

# Run database migrations (optional)
echo "Running database migrations..."
yarn prisma migrate deploy

# Seed the database
# echo "Seeding the database..."
# yarn seed

# Start Prisma Studio in the background
# echo "Starting Prisma Studio..."
# yarn prisma studio &

# Start the application
echo "Starting the application..."
yarn start

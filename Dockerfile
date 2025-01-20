# Use the official Node.js image
FROM node:18-alpine

# Install required dependencies (including OpenSSL)
RUN apk add --no-cache \
  openssl \
  libc6-compat

# Set the working directory
WORKDIR /usr/src/app

# Copy package files first and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy Prisma schema and generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Now, copy the rest of the application source code
COPY . .

# Run the build to compile TypeScript code into JavaScript
RUN yarn build

# Expose the port the app will run on
EXPOSE 8000

# Add a custom script to handle migrations and start the application
RUN echo '#!/bin/sh \n\
  # Run migrations at runtime\n\
  npx prisma migrate deploy\n\
  # Start the application\n\
  node /usr/src/app/dist/src/main.js' > /usr/src/app/start.sh

# Make the script executable
RUN chmod +x /usr/src/app/start.sh

# Start the application using the custom script
CMD ["/usr/src/app/start.sh"]

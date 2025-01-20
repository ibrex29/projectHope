# Use the official Node.js image
FROM node:18-alpine

# Install required dependencies (including OpenSSL)
RUN apk add --no-cache \
  openssl \
  libc6-compat

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy Prisma schema and generate Prisma client
COPY prisma ./prisma
RUN yarn prisma:generate

# Seed the database with initial records
RUN yarn seed

# Copy the source code
COPY . .

# Run the build to compile TypeScript code into JavaScript
RUN yarn build

# Expose the port the app will run on
EXPOSE 8000

# Copy the start.sh script and make it executable
COPY start.sh /usr/src/app/start.sh
RUN chmod +x /usr/src/app/start.sh

# Start the application using the start.sh script
CMD ["/bin/sh", "/usr/src/app/start.sh"]
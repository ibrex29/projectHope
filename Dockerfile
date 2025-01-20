# Use the official Node.js image
FROM node:18-alpine

# Install required dependencies (including OpenSSL)
RUN apk add --no-cache \
  openssl \
  libc6-compat

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies (including the NestJS CLI)
COPY package.json yarn.lock ./
RUN yarn install

# Install NestJS CLI globally
RUN yarn global add @nestjs/cli

# Copy Prisma schema and generate Prisma client
COPY prisma ./prisma
RUN yarn prisma:generate

# Copy the source code
COPY . .

# Run Prisma migration at runtime (via start.sh script)
RUN npx prisma migrate deploy --schema ./prisma/schema.prisma

# Run the build to compile TypeScript code into JavaScript
RUN yarn build

# Expose the port the app will run on
EXPOSE 8000

# Copy the start.sh script and make it executable
COPY start.sh /usr/src/app/start.sh
RUN chmod +x /usr/src/app/start.sh

# Start the application using the start.sh script
CMD ["/bin/sh", "/usr/src/app/start.sh"]

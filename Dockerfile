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

# Copy the source code
COPY . .

# Run the Prisma migrate command
RUN yarn prisma:migrate

# Run the build to compile TypeScript code into JavaScript
RUN yarn build

# Check if dist/src/main.js exists
RUN if [ ! -f /usr/src/app/dist/src/main.js ]; then echo "Error: dist/src/main.js not found"; exit 1; fi

# Expose the port the app will run on
EXPOSE 8000

# Start the application (Ensure dist/src/main.js exists)
CMD ["node", "/usr/src/app/dist/src/main.js"]

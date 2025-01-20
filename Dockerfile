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
RUN yarn install --production

# Copy Prisma schema and generate Prisma client
COPY prisma ./prisma
RUN yarn prisma:generate

# Copy the source code
COPY . .

# Set DATABASE_URL explicitly for the Prisma migration command (you can also export it dynamically at runtime)
RUN npx prisma migrate deploy --schema ./prisma/schema.prisma

# Run the build to compile TypeScript code into JavaScript
RUN yarn build

# Check if dist/src/main.js exists
RUN if [ ! -f /usr/src/app/dist/src/main.js ]; then echo "Error: dist/src/main.js not found"; exit 1; fi

# Expose the port the app will run on
EXPOSE 8000

# Start the application (Ensure dist/src/main.js exists)
CMD ["node", "/usr/src/app/dist/src/main.js"]

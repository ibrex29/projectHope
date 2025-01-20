# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy Prisma schema and generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the source code
COPY . .

# Build the NestJS app (compiles TypeScript to JavaScript)
RUN yarn build

# Ensure dist folder and main.js exists
RUN ls -al dist

# Expose the port the app will run on
EXPOSE 3000

# Start the application (Ensure dist/main.js exists)
CMD ["node", "dist/main"]

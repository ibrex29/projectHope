# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Install Yarn
RUN npm install -g yarn

# Copy package files and install dependencies using Yarn
COPY package.json yarn.lock ./
RUN yarn install

# Copy the source code
COPY . .

# Build the NestJS app
RUN yarn build

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["yarn", "start:prod"]

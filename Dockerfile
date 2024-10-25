# Base image with Node.js
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to install dependencies
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the project files
COPY . .

# Build the project
RUN yarn build

# Command to run the application
CMD ["yarn", "start"]

# Expose port 3001
EXPOSE 3001

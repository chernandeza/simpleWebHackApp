# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json into the container
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Bundle the app source inside the Docker container
COPY . .

# Make sure the public directory is copied for serving static files
COPY public /usr/src/app/public

# Expose port 3000 to the outside world
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

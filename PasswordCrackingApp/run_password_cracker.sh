#!/bin/bash

# Define variables
IMAGE_NAME="password-cracker-app"
PASSWORD_FILE="password.txt"
PORT=3000

# Prompt user for password and number of attempts
read -p "Enter the new password: " password
read -p "Enter the number of attempts: " attempts

# Update the password.txt file
echo "$password" > password.txt
echo "$attempts" >> password.txt
echo "password.txt has been updated."

# Get the container ID of the container running the password-cracking-app image
container_id=$(docker ps --filter "ancestor=password-cracker-app" --format "{{.ID}}")

if [ -z "$container_id" ]; then
    echo "No container running the $IMAGE_NAME image found."
    exit 1
fi

# Restart the container to refresh the mounted file
docker stop "$container_id"
docker container rm "$container_id"

# Step 1: Clean up unused Docker images (dangling images)
echo "Cleaning up unused Docker images..."
docker image prune -f

# Step 2: Build the Docker image
echo "Building the Docker image..."
docker build -t $IMAGE_NAME .

# Step 3: Check if the password.txt file exists
if [ ! -f "$PASSWORD_FILE" ]; then
    echo "Error: $PASSWORD_FILE not found! Please make sure it exists in the current directory."
    exit 1
fi

# Step 4: Run the Docker container with the password file mounted
echo "Running the Docker container..."
docker run -d --restart unless-stopped -p 3000:3000 -v $(pwd)/password.txt:/usr/src/app/password.txt password-cracker-app

# Final Step: Display success message
echo "Docker container is running at http://localhost:$PORT. Password file is mounted."
echo "Container Password-Cracker-App has been restarted to refresh data from password.txt."

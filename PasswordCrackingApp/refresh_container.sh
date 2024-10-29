#!/bin/bash

# Prompt user for password and number of attempts
read -p "Enter the new password: " password
read -p "Enter the number of attempts: " attempts

# Update the password.txt file
echo "$password" > password.txt
echo "$attempts" >> password.txt
echo "password.txt has been updated."

# Get the container ID of the container running the password-cracking-app image
container_id=$(docker ps --filter "ancestor=password-cracking-app" --format "{{.ID}}")

if [ -z "$container_id" ]; then
    echo "No container running the 'password-cracker-app' image found."
    exit 1
fi

# Restart the container to refresh the mounted file
docker restart "$container_id"
echo "Container $container_id has been restarted to refresh data from password.txt."

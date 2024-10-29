#!/bin/bash

# Define container names
PASSWORD_CRACKER_CONTAINER="password-cracking-app"
PHISHING_WEBFORM_CONTAINER="phishing-webform"

# Function to remove existing containers if they are running
cleanup() {
    echo "Cleaning up existing containers..."

    # Stop and remove password-cracker-app container if running
    if [ $(docker ps -aq -f name="$PASSWORD_CRACKER_CONTAINER") ]; then
        docker stop $PASSWORD_CRACKER_CONTAINER
        docker rm $PASSWORD_CRACKER_CONTAINER
    fi

    # Stop and remove phishing-webform container if running
    if [ $(docker ps -aq -f name="$PHISHING_WEBFORM_CONTAINER") ]; then
        docker stop $PHISHING_WEBFORM_CONTAINER
        docker rm $PHISHING_WEBFORM_CONTAINER
    fi
}

# Start the cleanup process
cleanup

# Start the password-cracker-app container
echo "Starting the password-cracker-app container..."
docker run -d -p 3000:3000 --name $PASSWORD_CRACKER_CONTAINER $PASSWORD_CRACKER_CONTAINER

# Start the phishing-webform container
echo "Starting the phishing-webform container in detached mode..."
docker run -d -p 8080:80 --name $PHISHING_WEBFORM_CONTAINER $PHISHING_WEBFORM_CONTAINER

# Check if the containers are running
echo "Checking container status..."
if [ $(docker ps -q -f name="$PASSWORD_CRACKER_CONTAINER") ]; then
    echo "password-cracking-app is running on port 3000"
else
    echo "Failed to start password-cracker-app."
fi

if [ $(docker ps -q -f name="$PHISHING_WEBFORM_CONTAINER") ]; then
    echo "phishing-webform is running on port 8080"
else
    echo "Failed to start phishing-webform."
fi

# Use an official Nginx image to serve static files
FROM nginx:alpine

# Copy the phishing webform HTML file to the Nginx HTML directory
COPY index.html /usr/share/nginx/html/index.html

# Copy the public folder to serve static assets (like the logo)
COPY public /usr/share/nginx/html/public

# Expose port 80
EXPOSE 80

#!/bin/bash

# Build the Docker image
docker build -t carcinoma-api .

# Run the container
docker run -d -p 8000:8000 --name carcinoma-api-container carcinoma-api

echo "API is running at http://localhost:8000"
echo "API documentation is available at http://localhost:8000/docs"

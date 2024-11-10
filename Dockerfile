# Use the official Ubuntu base image
FROM ubuntu:20.04

# Set the working directory
WORKDIR /app

# Install system dependencies including Python and pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    curl \
    && apt-get clean

# Copy your code into the container
COPY . /app/

# Verify the backend directory exists in the container
RUN ls -l /app/backend  # This will ensure backend folder exists

# Set the working directory to /app/backend
WORKDIR /app/backend

# Install the dependencies from the backend's requirements.txt
RUN python3 -m pip install -r requirements.txt

# Expose the necessary port (adjust if needed)
EXPOSE 8080

# Command to start the application
CMD ["python3", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080", "--no-access-log"]


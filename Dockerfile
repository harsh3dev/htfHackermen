# Use the official Ubuntu base image
FROM ubuntu:20.04

# Set the working directory
WORKDIR /app

# Install system dependencies including Python 3.9 and pip
RUN apt-get update && apt-get install -y \
    python3.9 \
    python3.9-distutils \
    python3.9-dev \
    build-essential \
    curl \
    && apt-get clean

# Install pip for Python 3.9
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && python3.9 get-pip.py

# Copy your code into the container
COPY . /app/

# Set the working directory to /app/backend
WORKDIR /app/backend

# Install the dependencies from the backend's requirements.txt using Python 3.9
RUN python3.9 -m pip install -r requirements.txt

# Expose the necessary port
EXPOSE 8080

# Command to start the application using Python 3.9
CMD ["python3.9", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080", "--no-access-log"]

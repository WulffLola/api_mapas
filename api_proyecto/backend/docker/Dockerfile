# ubuntu
# TODO: migrate to debian:alpine
FROM python:3.9.12

# Update system packages and install necessary dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    curl \
    unzip \
    nano \
    make \
    automake \
    gcc \
    g++ \    
    subversion \
    unixodbc-dev \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
# Python won’t try to write .pyc or .pyo files on the import of source modules.
ENV PYTHONDONTWRITEBYTECODE 1
# ensures that the python output i.e. the stdout and stderr 
# streams are sent straight to terminal (e.g. your container log) 
# without being first buffered and that you can see the output 
# of your application (e.g. django logs) in real time.
ENV PYTHONUNBUFFERED 1


# Set working directory
WORKDIR /api_mapas/

# Copy requirements and install dependencies
COPY ./requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

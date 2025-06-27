# Use official Python image
FROM python:3.11-slim

RUN apt-get update && apt-get upgrade -y && apt-get clean
# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements_production.txt .
RUN pip install --upgrade pip && pip install -r requirements_production.txt

# Copy project files
COPY . .

COPY entrypoint.sh .
ENTRYPOINT ["/app/entrypoint.sh"]

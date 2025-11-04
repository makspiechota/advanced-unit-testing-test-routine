#!/bin/bash

# Start all services using Docker Compose

set -e

echo "=================================="
echo "Starting Exercise Environment"
echo "=================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed"
    echo "Please install Docker from: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "Error: Docker Compose is not installed"
    echo "Please install Docker Compose from: https://docs.docker.com/compose/install/"
    exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo "Error: Docker daemon is not running"
    echo "Please start Docker Desktop or Docker daemon"
    exit 1
fi

echo "✓ Docker is installed and running"
echo ""

# Start services
echo "Starting services with Docker Compose..."
docker compose up -d

echo ""
echo "Waiting for services to be ready..."
sleep 5

# Check service health
echo ""
echo "Service Status:"
docker compose ps

echo ""
echo "=================================="
echo "Environment Ready! ✓"
echo "=================================="
echo ""
echo "Services running:"
echo "  - PostgreSQL: localhost:5432"
echo "  - Email Verification Service: localhost:3001"
echo "  - Email Service: localhost:3002"
echo ""
echo "You can now:"
echo "  - Run tests: npm test"
echo "  - View logs: npm run docker:logs"
echo "  - Stop services: npm run docker:down"
echo ""
echo "Happy coding! 🚀"

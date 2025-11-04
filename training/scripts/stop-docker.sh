#!/bin/bash

# Stop all Docker services

echo "Stopping all services..."
docker compose down

echo ""
echo "Services stopped successfully! ✓"
echo ""
echo "To completely remove all data (database, volumes):"
echo "  npm run docker:clean"

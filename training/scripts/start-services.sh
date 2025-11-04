#!/bin/bash

# Start all external services required for the exercise

echo "Starting external services..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "Warning: PostgreSQL does not appear to be running on localhost:5432"
    echo "Please start PostgreSQL before running this script"
    exit 1
fi

# Create log directory
mkdir -p logs

echo "Starting Email Verification Service on port 3001..."
npx ts-node services/emailVerificationServer.ts > logs/email-verification.log 2>&1 &
EMAIL_VERIFICATION_PID=$!
echo "Email Verification Service started (PID: $EMAIL_VERIFICATION_PID)"

sleep 1

echo "Starting Email Service on port 3002..."
npx ts-node services/emailServer.ts > logs/email.log 2>&1 &
EMAIL_SERVICE_PID=$!
echo "Email Service started (PID: $EMAIL_SERVICE_PID)"

echo ""
echo "All services started successfully!"
echo ""
echo "Service logs are available in the logs/ directory:"
echo "  - Email Verification: logs/email-verification.log"
echo "  - Email Service: logs/email.log"
echo ""
echo "To stop services, run: ./scripts/stop-services.sh"
echo ""

# Save PIDs to file for later cleanup
echo $EMAIL_VERIFICATION_PID > logs/email-verification.pid
echo $EMAIL_SERVICE_PID > logs/email.pid

echo "Ready for testing!"

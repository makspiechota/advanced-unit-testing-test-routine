#!/bin/bash

# Stop all external services

echo "Stopping external services..."

if [ -f logs/email-verification.pid ]; then
    PID=$(cat logs/email-verification.pid)
    if ps -p $PID > /dev/null 2>&1; then
        kill $PID
        echo "Stopped Email Verification Service (PID: $PID)"
    else
        echo "Email Verification Service is not running"
    fi
    rm logs/email-verification.pid
fi

if [ -f logs/email.pid ]; then
    PID=$(cat logs/email.pid)
    if ps -p $PID > /dev/null 2>&1; then
        kill $PID
        echo "Stopped Email Service (PID: $PID)"
    else
        echo "Email Service is not running"
    fi
    rm logs/email.pid
fi

echo ""
echo "All services stopped."

#!/bin/bash

# Database setup script for User Registration Exercise
# This script creates the database, user, and initializes the schema

set -e  # Exit on error

DB_NAME="user_registration"
DB_USER="testuser"
DB_PASSWORD="testpass"

echo "=================================="
echo "Database Setup Script"
echo "=================================="
echo ""

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "Error: PostgreSQL is not running on localhost:5432"
    echo "Please start PostgreSQL first."
    exit 1
fi

echo "PostgreSQL is running ✓"
echo ""

# Create database and user
echo "Creating database and user..."
psql -U postgres -h localhost << EOF
-- Drop existing database if it exists (optional, for clean setup)
DROP DATABASE IF EXISTS $DB_NAME;
DROP USER IF EXISTS $DB_USER;

-- Create database and user
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF

if [ $? -eq 0 ]; then
    echo "Database and user created successfully ✓"
else
    echo "Error: Failed to create database and user"
    echo "Make sure you have PostgreSQL superuser access"
    exit 1
fi

echo ""

# Grant schema privileges (needed for PostgreSQL 15+)
echo "Granting schema privileges..."
psql -U postgres -h localhost -d $DB_NAME << EOF
GRANT ALL ON SCHEMA public TO $DB_USER;
EOF

echo ""

# Initialize the database schema
echo "Initializing database schema..."
psql -U $DB_USER -h localhost -d $DB_NAME -f database/init.sql

if [ $? -eq 0 ]; then
    echo "Database schema initialized successfully ✓"
else
    echo "Error: Failed to initialize database schema"
    exit 1
fi

echo ""

# Verify the setup
echo "Verifying database setup..."
npm run setup:db

echo ""
echo "=================================="
echo "Database setup completed! ✓"
echo "=================================="
echo ""
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Password: $DB_PASSWORD"
echo "Host: localhost"
echo "Port: 5432"
echo ""
echo "You can now run the tests with: npm test"
echo "Or start the services with: npx ts-node services/emailVerificationServer.ts"

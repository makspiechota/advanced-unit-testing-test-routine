# Unit Testing Exercise: User Registration Feature

## Objective
Implement and test a user registration feature that interacts with external dependencies. This exercise will teach you how to write effective unit tests with mocks and then verify your implementation with real services using dependency injection.

## Scenario
Build a user registration service that:
- Checks if user already exists in PostgreSQL database
- Saves the user to the database
- Sends a welcome email via an external email service

## External Services

### PostgreSQL Database (Port 5432)
- Database: `user_registration`
- User: `testuser`
- Password: `testpass`
- Client: `UserRepository` in `src/library/`

Connect to database:
$ export PGPASSWORD=testpass
$ psql -h localhost -p 5432 -U testuser -d user_registration

### Email Service - Unreliable (Port 3002)
- **Purpose**: Simulates real-world unreliable external API
- **Behavior**: 30% random failure rate, 3-second delay on success
- **API**: `POST /send` with `{ to, subject, body }`
- **Client**: `EmailService` in `src/library/`
- **Use case**: Students learn to handle failures and timeouts

$ npm run example:email

### Email Service - Reliable (Port 3003)
- **Purpose**: 100% reliable service with different API contract
- **Behavior**: Instant response, no failures
- **API**: `POST /sendMessage` with `{ recipient, title, content }` (different from unreliable!)
- **Client**: `EmailServiceReliable` in `src/library/`
- **Use case**: Students learn adapter patterns for different APIs

$ npm run example:email-reliable

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Docker and Docker Compose**
3. **npm** or **yarn**
4. A code editor (VS Code recommended)

## Setup Instructions

### Quick Start 🚀

**1. Install Dependencies**

```bash
npm install
```

**2. Start All Services**

```bash
npm start
```

This single command will:
- Start PostgreSQL database (port 5432)
- Start Unreliable Email Service (port 3002)
- Start Reliable Email Service (port 3003)
- Initialize the database schema
- Verify all services are running

**3. Explore the Client Libraries (Optional)**

Run examples to understand how the services work:

```bash
# Test unreliable email service (30% failure, 3s delay)
npm run example:email

# Test reliable email service (100% success, instant)
npm run example:email-reliable

# Test PostgreSQL user repository
npm run example:users
```

**4. When Done**

```bash
npm stop
```

To completely clean up (removes database data):
```bash
npm run docker:clean
```

## Your Tasks

### Step 1: Understand the Client Libraries

Before implementing, review the provided client libraries in `src/library/`:

**EmailService** (`src/library/EmailService.ts`)
```typescript
async sendEmail(to: string, subject: string, body: string): Promise<void>
// Throws error on failure (30% chance) or after 3s delay
```

**EmailServiceReliable** (`src/library/EmailServiceReliable.ts`)
```typescript
async sendMessage(recipient: string, title: string, content: string): Promise<{ id: string }>
// Different API! Returns message ID, never fails
```

**UserRepository** (`src/library/UserRepository.ts`)
```typescript
async findByEmail(email: string): Promise<User | null>
async createUser(userData: CreateUserData): Promise<User>
async getAllUsers(): Promise<User[]>
async deleteUser(email: string): Promise<boolean>
async close(): Promise<void>
```

### Step 2: Implement UserRegistrationService

Open `src/UserRegistrationService.ts` and implement the `registerUser` method.

**Requirements:**
1. Check if user already exists in the database
2. Hash the password (for this exercise, append '-hashed' to the password)
3. Save the new user to the database
4. Send a welcome email

### Step 3: Write Unit Tests with Mocks

Open `tests/UserRegistrationService.test.ts` and implement comprehensive test cases.

**Required test coverage:**
- ✅ Successful registration
- ✅ Sending welcome email after registration
- ✅ Missing required fields (email, name, password)
- ✅ Duplicate user registration
- ✅ Database save errors
- ✅ Database lookup errors
- ✅ Email sending failures

### Step 4: Run Tests

```bash
npm test
```

Run tests in watch mode during development:
```bash
npm run test:watch
```

### Step 5: Test with Real Services (Production Mode)

Once your implementation and tests pass, verify with real services:

```bash
# Make sure services are running
npm start

# Run with real dependencies
npm run dev
```

## Common Issues and Solutions

### Docker Issues

- **Error: "Cannot connect to the Docker daemon"**
  - Make sure Docker Desktop is running
  - On Linux: `sudo systemctl start docker`

- **Error: "Port already in use"**
  - Another service is using ports 5432, 3002, or 3003
  - Stop conflicting services or change ports in `docker-compose.yml`

- **Services not starting**
  - Check logs: `npm run docker:logs`
  - Restart services: `npm run docker:restart`
  - Clean restart: `npm run docker:clean && npm start`

- **Database connection refused**
  - Wait a few seconds for PostgreSQL to fully start
  - Check service status: `docker compose ps`

- **Old cached code running**
  - Rebuild containers: `docker compose up -d --build`

### Useful Commands

```bash
# View all running containers
docker compose ps

# View logs from all services
npm run docker:logs

# Restart all services
npm run docker:restart

# Stop services
npm stop

# Clean everything (removes data)
npm run docker:clean

# Check if PostgreSQL is accessible
npm run setup:db

# Run examples
npm run example:email          # Test unreliable email service
npm run example:email-reliable # Test reliable email service
npm run example:users          # Test PostgreSQL repository
```


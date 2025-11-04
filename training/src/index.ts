/**
 * Production Entry Point
 *
 * This demonstrates running the UserRegistrationService with real adapters
 * following the hexagonal architecture pattern.
 *
 * Make sure services are running:
 * - PostgreSQL: docker-compose up -d
 * - Email service: npm run services:start
 *
 * Then run in production mode:
 * npm run dev
 */

import { UserRegistrationService } from "./UserRegistrationService";
import { UserRepositoryPostgresqlAdapter } from "./infrastructure/adapters/user-repository-postgresql/user-repository-postgresql.adapter";
import { EmailSenderHttpReliableAdapter } from "./infrastructure/adapters/email-sender-http-reliable/email-sender-http-reliable.adapter";

async function main() {
  console.log("=".repeat(50));
  console.log("User Registration - Production Mode");
  console.log("=".repeat(50));
  console.log();

  // Instantiate real adapters (infrastructure)
  const userRepository = new UserRepositoryPostgresqlAdapter();
  const emailSender = new EmailSenderHttpReliableAdapter("localhost", 3003);

  // Inject adapters into the service (dependency inversion)
  const registrationService = new UserRegistrationService(userRepository, emailSender);

  try {
    console.log("Attempting to register new user...");
    console.log("Email: testuser@example.com");
    console.log("Name: Test User");
    console.log();

    const result = await registrationService.registerUser({
      email: "testuser@example.com",
      name: "Test User",
      password: "SecurePassword123",
    });

    if (result.success) {
      console.log("✅ SUCCESS! User registered successfully");
      console.log(`User ID: ${result.userId}`);
    } else {
      console.log("❌ FAILED! Registration failed");
      console.log(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error("❌ ERROR:", (error as Error).message);
    console.log();
    console.log("Make sure the following services are running:");
    console.log("- PostgreSQL database (docker-compose up -d)");
    console.log("- Reliable email service (npm run services:start)");
  } finally {
    await userRepository.close();
    console.log();
    console.log("Database connection closed");
  }
}

main().catch(console.error);

/**
 * Production Entry Point
 *
 * This demonstrates running the UserRegistrationService with real adapters
 * instead of mocks. Students should implement dependency injection in their
 * UserRegistrationService to accept the real EmailService and UserRepository.
 *
 * Make sure services are running:
 * npm start
 *
 * Then run in production mode:
 * npm run dev
 */

import { UserRegistrationService } from "./UserRegistrationService";
import { EmailService } from "./library/EmailService";
import { EmailServiceReliable } from "./library/EmailServiceReliable";
import { UserRepository } from "./library/UserRepository";

async function main() {
  console.log("=".repeat(50));
  console.log("User Registration - Production Mode");
  console.log("=".repeat(50));
  console.log();

  // TODO: Students need to modify UserRegistrationService constructor
  // to accept dependencies (EmailService and UserRepository)
  //
  // Example expected constructor:
  // constructor(emailService: EmailService, userRepository: UserRepository)

  const emailService = new EmailService("localhost", 3002);
  const userRepository = new UserRepository();

  // For now, this will fail because students haven't implemented dependency injection yet
  const registrationService = new UserRegistrationService();

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
      console.log("SUCCESS! User registered successfully");
      console.log(`User ID: ${result.userId}`);
    } else {
      console.log("FAILED! Registration failed");
      console.log(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error("ERROR:", (error as Error).message);
    console.log();
    console.log("Note: You need to implement UserRegistrationService first!");
    console.log("See src/UserRegistrationService.ts for requirements.");
  } finally {
    await userRepository.close();
    console.log();
    console.log("Database connection closed");
  }
}

main().catch(console.error);

/**
 * Example: Using the UserRepository class
 *
 * This demonstrates how to use the UserRepository implementation
 * to create and manage users in PostgreSQL.
 *
 * Make sure the database is running:
 * npm start
 *
 * Then run this example:
 * npm run example:users
 */

import { UserRepository } from "../src/library/UserRepository";

async function testUserRepository() {
  // Create an instance of the UserRepository
  const userRepository = new UserRepository();

  console.log("Testing UserRepository class...\n");
  console.log("Database: PostgreSQL on localhost:5432\n");

  try {
    // Test 1: Get all existing users
    console.log("1. Getting all existing users:");
    try {
      const users = await userRepository.getAllUsers();
      console.log(`   Found ${users.length} user(s) in database`);
      if (users.length > 0) {
        users.forEach((user) => {
          console.log(`   - ${user.email} (${user.name})`);
        });
      }
      console.log();
    } catch (error) {
      console.error("   Error:", (error as Error).message, "\n");
    }

    // Test 2: Create a new user
    console.log("2. Creating a new user:");
    try {
      console.log("   Creating user: john@example.com");
      const newUser = await userRepository.createUser({
        email: "john@example.com",
        name: "John Doe",
        passwordHash: "hashed_password_123",
      });
      console.log(`   User created successfully!`);
      console.log(`   ID: ${newUser.id}`);
      console.log(`   Email: ${newUser.email}`);
      console.log(`   Name: ${newUser.name}\n`);
    } catch (error) {
      console.error("   Error:", (error as Error).message, "\n");
    }

    // Test 3: Try to create a duplicate user (should fail)
    console.log("3. Trying to create duplicate user:");
    try {
      console.log("   Creating user with same email: john@example.com");
      await userRepository.createUser({
        email: "john@example.com",
        name: "John Smith",
        passwordHash: "different_password",
      });
      console.log("   User created successfully!\n");
    } catch (error) {
      console.error("   Error:", (error as Error).message);
      console.log("   (This is expected behavior)\n");
    }

    // Test 4: Find user by email
    console.log("4. Finding user by email:");
    try {
      console.log("   Searching for: john@example.com");
      const foundUser = await userRepository.findByEmail("john@example.com");
      if (foundUser) {
        console.log("   User found!");
        console.log(`   ID: ${foundUser.id}`);
        console.log(`   Name: ${foundUser.name}`);
        console.log(`   Created: ${foundUser.createdAt}\n`);
      } else {
        console.log("   User not found\n");
      }
    } catch (error) {
      console.error("   Error:", (error as Error).message, "\n");
    }

    // Test 5: Find non-existent user
    console.log("5. Finding non-existent user:");
    try {
      console.log("   Searching for: nonexistent@example.com");
      const foundUser = await userRepository.findByEmail(
        "nonexistent@example.com"
      );
      if (foundUser) {
        console.log("   User found!\n");
      } else {
        console.log("   User not found (expected)\n");
      }
    } catch (error) {
      console.error("   Error:", (error as Error).message, "\n");
    }

    // Test 6: Create multiple users
    console.log("6. Creating multiple users:");
    const usersToCreate = [
      { email: "alice@example.com", name: "Alice Johnson", passwordHash: "hash1" },
      { email: "bob@example.com", name: "Bob Wilson", passwordHash: "hash2" },
      { email: "charlie@example.com", name: "Charlie Brown", passwordHash: "hash3" },
    ];

    for (const userData of usersToCreate) {
      try {
        console.log(`   Creating user: ${userData.email}`);
        await userRepository.createUser(userData);
      } catch (error) {
        console.error(`   Failed: ${(error as Error).message}`);
      }
    }
    console.log();

    // Test 7: Get all users again
    console.log("7. Getting all users after creation:");
    try {
      const users = await userRepository.getAllUsers();
      console.log(`   Total users: ${users.length}`);
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (${user.name})`);
      });
      console.log();
    } catch (error) {
      console.error("   Error:", (error as Error).message, "\n");
    }

    // Test 8: Delete a user
    console.log("8. Deleting a user:");
    try {
      console.log("   Deleting user: john@example.com");
      const deleted = await userRepository.deleteUser("john@example.com");
      if (deleted) {
        console.log("   User deleted successfully\n");
      } else {
        console.log("   User not found\n");
      }
    } catch (error) {
      console.error("   Error:", (error as Error).message, "\n");
    }

    // Test 9: Try to find deleted user
    console.log("9. Verifying user deletion:");
    try {
      console.log("   Searching for: john@example.com");
      const foundUser = await userRepository.findByEmail("john@example.com");
      if (foundUser) {
        console.log("   User still exists (unexpected)\n");
      } else {
        console.log("   User not found (confirmed deleted)\n");
      }
    } catch (error) {
      console.error("   Error:", (error as Error).message, "\n");
    }

    console.log("=".repeat(50));
    console.log("Testing completed!");
    console.log("\nNote: Users created during this test remain in the database");
    console.log("You can clean them up by restarting Docker or running:");
    console.log("  docker compose down -v");

  } finally {
    // Always close the database connection
    await userRepository.close();
    console.log("\nDatabase connection closed");
  }
}

testUserRepository().catch(console.error);

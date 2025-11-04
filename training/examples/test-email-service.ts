/**
 * Example: Using the EmailService class
 *
 * This demonstrates how to use the EmailService implementation
 * to send emails.
 *
 * Make sure the email service is running:
 * npm start
 *
 * Then run this example:
 * npm run example:email
 */

import { EmailService } from "../src/library/EmailService";

async function testEmailService() {
  // Create an instance of the EmailService
  const emailService = new EmailService("localhost", 3002);

  console.log("Testing EmailService class...\n");
  console.log(
    "Note: Email service has 30% random failure rate and 3s delay on success\n"
  );

  // Test 1: Send valid email (will take ~3 seconds if successful, or fail randomly)
  console.log("1. Sending valid email:");
  try {
    console.log("   Calling emailService.sendEmail()...");
    await emailService.sendEmail(
      "user@example.com",
      "Welcome!",
      "Hello, welcome to our platform!"
    );
    console.log("   Email sent successfully!\n");
  } catch (error) {
    console.error("   Error:", (error as Error).message, "\n");
  }

  // Test 2: Send another email (show random behavior)
  console.log("2. Sending another email:");
  try {
    console.log("   Calling emailService.sendEmail()...");
    await emailService.sendEmail(
      "john@example.com",
      "Newsletter",
      "Check out our latest updates!"
    );
    console.log("   Email sent successfully!\n");
  } catch (error) {
    console.error("   Error:", (error as Error).message, "\n");
  }

  // Test 3: Invalid email address
  console.log("3. Testing invalid email address:");
  try {
    console.log("   Calling emailService.sendEmail() with invalid email...");
    await emailService.sendEmail(
      "invalid-email",
      "Test",
      "This should fail validation"
    );
    console.log("   Email sent successfully!\n");
  } catch (error) {
    console.error("   Error:", (error as Error).message, "\n");
  }

  // Test 4: Send multiple emails to show random failures
  console.log("4. Sending multiple emails (to demonstrate random failures):");
  const recipients = [
    "alice@example.com",
    "bob@example.com",
    "charlie@example.com",
  ];

  for (const recipient of recipients) {
    console.log(`   Sending to ${recipient}...`);
    try {
      await emailService.sendEmail(
        recipient,
        "Batch Email",
        "This is a batch email test"
      );
      console.log(`   Sent to ${recipient}`);
    } catch (error) {
      console.error(
        `   Failed to send to ${recipient}: ${(error as Error).message}`
      );
    }
  }

  console.log("=".repeat(50));
  console.log("Testing completed!");
  console.log("Notice how some emails succeed (took ~3 seconds)");
  console.log(
    'and some fail randomly with "SMTP server temporarily unavailable"'
  );
}

testEmailService().catch(console.error);

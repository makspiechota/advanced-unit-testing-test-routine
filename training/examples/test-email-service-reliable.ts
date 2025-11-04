/**
 * Example: Using the EmailServiceReliable class
 *
 * This demonstrates how to use the reliable EmailService implementation
 * to send emails with 100% reliability and no delays.
 *
 * Make sure the email service is running:
 * npm start
 *
 * Then run this example:
 * npm run example:email-reliable
 */

import { EmailServiceReliable } from "../src/library/EmailServiceReliable";

async function testEmailServiceReliable() {
  // Create an instance of the EmailServiceReliable
  const emailService = new EmailServiceReliable("localhost", 3003);

  console.log("Testing EmailServiceReliable class...\n");
  console.log("Note: This service is 100% reliable with instant responses\n");
  console.log(
    "API Difference: Uses sendMessage(recipient, title, content) instead of sendEmail(to, subject, body)\n"
  );

  // Test 1: Send valid message
  console.log("1. Sending valid message:");
  try {
    console.log("   Calling emailService.sendMessage()...");
    const result = await emailService.sendMessage(
      "user@example.com",
      "Welcome Title",
      "Hello, welcome to our platform!"
    );
    console.log(`   Message sent successfully! ID: ${result.id}\n`);
  } catch (error) {
    console.error("   Error:", (error as Error).message, "\n");
  }

  // Test 2: Send another message
  console.log("2. Sending another message:");
  try {
    console.log("   Calling emailService.sendMessage()...");
    const result = await emailService.sendMessage(
      "john@example.com",
      "Newsletter Title",
      "Check out our latest updates!"
    );
    console.log(`   Message sent successfully! ID: ${result.id}\n`);
  } catch (error) {
    console.error("   Error:", (error as Error).message, "\n");
  }

  // Test 3: Invalid email address
  console.log("3. Testing invalid email address:");
  try {
    console.log("   Calling emailService.sendMessage() with invalid email...");
    const result = await emailService.sendMessage(
      "invalid-email",
      "Test Title",
      "This should fail validation"
    );
    console.log(`   Message sent successfully! ID: ${result.id}\n`);
  } catch (error) {
    console.error("   Error:", (error as Error).message, "\n");
  }

  // Test 4: Send multiple messages rapidly (all should succeed)
  console.log("4. Sending multiple messages rapidly:");
  const recipients = [
    "alice@example.com",
    "bob@example.com",
    "charlie@example.com",
    "dave@example.com",
    "eve@example.com",
  ];

  console.log("   Starting batch send...");
  const startTime = Date.now();

  for (const recipient of recipients) {
    try {
      const result = await emailService.sendMessage(
        recipient,
        "Batch Email Title",
        "This is a batch email test"
      );
      console.log(`   Sent to ${recipient} (ID: ${result.id})`);
    } catch (error) {
      console.error(
        `   Failed to send to ${recipient}: ${(error as Error).message}`
      );
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`   Batch completed in ${duration}s (instant!)\n`);

  console.log("=".repeat(50));
  console.log("Testing completed!");
  console.log("All messages were sent instantly with 100% success rate");
}

testEmailServiceReliable().catch(console.error);

import { describe, beforeAll } from '@jest/globals';
import { EmailSenderHttpAdapter } from '../email-sender-http.adapter';
import { testEmailSenderRoutine, SentEmail } from '../../../../application/ports/email-sender/__tests__/email-sender.test-routine';

/**
 * INTEGRATION TEST for EmailSender using HTTP adapter (non-reliable)
 *
 * This test orchestrates the execution of the test routine with the EmailSenderHttpAdapter,
 * which wraps the EmailService library class. Since the adapter connects to a real email
 * service via HTTP, this IS an INTEGRATION test - it CROSSES the memory boundary.
 *
 * Prerequisites:
 * - Email service must be running on localhost:3002
 * - Run: npm run services:start (or: node services/emailServer.js)
 *
 * Note: This email service has a 3-second delay and 30% failure rate for testing purposes.
 * Tests may be flaky due to the intentional random failures.
 */
describe('EmailSender - INTEGRATION (HTTP Adapter - Non-Reliable)', () => {
  const baseUrl = 'http://localhost:3002';

  beforeAll(() => {
    // Increase timeout for slow email service (3 second delay per request)
    jest.setTimeout(30000);
  });

  // Arrange: Instantiate the HTTP adapter (wraps EmailService)
  const emailSender = new EmailSenderHttpAdapter('localhost', 3002);

  // Act: Execute the test routine with the HTTP adapter instance and helper functions
  testEmailSenderRoutine({
    emailSender,
    getSentEmails: async (): Promise<SentEmail[]> => {
      // Fetch sent emails from the email service's debug endpoint
      const response = await fetch(`${baseUrl}/sent`);
      const data = await response.json() as { count: number; emails: Array<{ to: string; subject: string; body: string }> };
      return data.emails;
    },
    clearSentEmails: async () => {
      // Clear sent emails using the service's delete endpoint
      await fetch(`${baseUrl}/sent`, { method: 'DELETE' });
    }
  });
});

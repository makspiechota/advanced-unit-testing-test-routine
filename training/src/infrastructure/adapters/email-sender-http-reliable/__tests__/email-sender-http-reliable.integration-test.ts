import { describe, beforeAll } from '@jest/globals';
import { EmailSenderHttpReliableAdapter } from '../email-sender-http-reliable.adapter';
import { testEmailSenderRoutine, SentEmail } from '../../../../application/ports/email-sender/__tests__/email-sender.test-routine';

/**
 * INTEGRATION TEST for EmailSender using HTTP Reliable adapter
 *
 * This test orchestrates the execution of the test routine with the EmailSenderHttpReliableAdapter,
 * which wraps the EmailServiceReliable library class. Since the adapter connects to a real email
 * service via HTTP, this IS an INTEGRATION test - it CROSSES the memory boundary.
 *
 * Prerequisites:
 * - Reliable email service must be running on localhost:3003
 * - Run: npm run services:start (or: node services/emailServerReliable.js)
 *
 * Note: This email service is "reliable" - it has NO failure rate and is faster.
 * These tests should be more stable than the non-reliable version.
 */
describe('EmailSender - INTEGRATION (HTTP Adapter - Reliable)', () => {
  const baseUrl = 'http://localhost:3003';

  beforeAll(() => {
    // Increase timeout for potential network delays
    jest.setTimeout(30000);
  });

  // Arrange: Instantiate the HTTP Reliable adapter (wraps EmailServiceReliable)
  const emailSender = new EmailSenderHttpReliableAdapter('localhost', 3003);

  // Act: Execute the test routine with the HTTP Reliable adapter instance and helper functions
  // This is the SAME test routine used for the stub AND the non-reliable adapter!
  testEmailSenderRoutine({
    emailSender,
    getSentEmails: async (): Promise<SentEmail[]> => {
      // Fetch sent emails from the reliable email service's debug endpoint
      const response = await fetch(`${baseUrl}/sent`);
      const data = await response.json() as { count: number; emails: Array<{ recipient: string; title: string; content: string }> };
      // Map the different field names from reliable service
      return data.emails.map(e => ({
        to: e.recipient,
        subject: e.title,
        body: e.content
      }));
    },
    clearSentEmails: async () => {
      // Clear sent emails using the service's delete endpoint
      await fetch(`${baseUrl}/sent`, { method: 'DELETE' });
    }
  });
});

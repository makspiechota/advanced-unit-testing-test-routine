import { describe } from '@jest/globals';
import { EmailSenderStub } from '../email-sender.stub';
import { testEmailSenderRoutine } from '../../__tests__/email-sender.test-routine';

/**
 * UNIT TEST for EmailSender using in-memory stub
 *
 * This test orchestrates the execution of the test routine with the stub implementation.
 * Since the stub operates entirely in memory, this is a UNIT test - it does NOT cross
 * the memory boundary.
 */
describe('EmailSender - UNIT (Stub Implementation)', () => {
  // Arrange: Instantiate the stub implementation
  const emailSender = new EmailSenderStub();

  // Act: Execute the test routine with the stub instance and helper functions
  testEmailSenderRoutine({
    emailSender,
    getSentEmails: async () => {
      // Use the stub's built-in method to get sent emails
      return emailSender.getSentEmails().map(e => ({
        to: e.message.to,
        subject: e.message.subject,
        body: e.message.body
      }));
    },
    clearSentEmails: async () => {
      // Clear the stub's internal storage
      emailSender.clear();
    }
  });
});

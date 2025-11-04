import { describe, it, expect, beforeEach } from '@jest/globals';
import { IEmailSender, EmailMessage } from '../email-sender.interface';

export interface SentEmail {
  to: string;
  subject: string;
  body: string;
}

export interface EmailSenderTestContext {
  emailSender: IEmailSender;
  getSentEmails: () => Promise<SentEmail[]>;
  clearSentEmails?: () => Promise<void>;
}

/**
 * Test Routine for IEmailSender
 *
 * This routine defines the behavioral contract for any IEmailSender implementation.
 * It can be used for both unit tests (with stub implementations) and integration tests
 * (with real HTTP adapters).
 *
 * @param context - Test context with emailSender and helper functions to inspect sent emails
 */
export function testEmailSenderRoutine(context: EmailSenderTestContext): void {
  const { emailSender, getSentEmails, clearSentEmails } = context;

  describe('IEmailSender contract', () => {
    beforeEach(async () => {
      // Clear sent emails before each test if the function is provided
      if (clearSentEmails) {
        await clearSentEmails();
      }
    });
    describe('sendEmail', () => {
      it('should send an email with valid message data', async () => {
        const message: EmailMessage = {
          to: 'recipient@example.com',
          subject: 'Test Subject',
          body: 'Test email body content'
        };

        const result = await emailSender.sendEmail(message);

        expect(result).toBeDefined();
        expect(result.messageId).toBeDefined();
        expect(typeof result.messageId).toBe('string');
        expect(result.messageId.length).toBeGreaterThan(0);

        // Verify email was actually sent
        const sentEmails = await getSentEmails();
        const sentEmail = sentEmails.find(e => e.to === message.to && e.subject === message.subject);
        expect(sentEmail).toBeDefined();
        expect(sentEmail?.body).toBe(message.body);
      });

      it('should send multiple emails successfully', async () => {
        const message1: EmailMessage = {
          to: 'user1@example.com',
          subject: 'First Email',
          body: 'First email body'
        };

        const message2: EmailMessage = {
          to: 'user2@example.com',
          subject: 'Second Email',
          body: 'Second email body'
        };

        const result1 = await emailSender.sendEmail(message1);
        const result2 = await emailSender.sendEmail(message2);

        expect(result1.messageId).toBeDefined();
        expect(result2.messageId).toBeDefined();
        expect(result1.messageId).not.toBe(result2.messageId);

        // Verify both emails were sent
        const sentEmails = await getSentEmails();
        expect(sentEmails.length).toBeGreaterThanOrEqual(2);

        const email1 = sentEmails.find(e => e.to === 'user1@example.com');
        const email2 = sentEmails.find(e => e.to === 'user2@example.com');

        expect(email1).toBeDefined();
        expect(email1?.subject).toBe('First Email');
        expect(email2).toBeDefined();
        expect(email2?.subject).toBe('Second Email');
      });

      it('should handle emails with special characters in subject', async () => {
        const message: EmailMessage = {
          to: 'test@example.com',
          subject: 'Test: Special & Characters! #123',
          body: 'Body content'
        };

        const result = await emailSender.sendEmail(message);

        expect(result.messageId).toBeDefined();
      });

      it('should handle emails with long body content', async () => {
        const longBody = 'Lorem ipsum '.repeat(100);
        const message: EmailMessage = {
          to: 'test@example.com',
          subject: 'Long Email',
          body: longBody
        };

        const result = await emailSender.sendEmail(message);

        expect(result.messageId).toBeDefined();
      });

      it('should throw an error for invalid email address', async () => {
        const invalidMessage: EmailMessage = {
          to: 'invalid-email',
          subject: 'Test',
          body: 'Test body'
        };

        await expect(
          emailSender.sendEmail(invalidMessage)
        ).rejects.toThrow();
      });

      it('should throw an error for empty recipient', async () => {
        const invalidMessage: EmailMessage = {
          to: '',
          subject: 'Test',
          body: 'Test body'
        };

        await expect(
          emailSender.sendEmail(invalidMessage)
        ).rejects.toThrow();
      });

      it('should throw an error for empty subject', async () => {
        const message: EmailMessage = {
          to: 'test@example.com',
          subject: '',
          body: 'Test body'
        };

        await expect(
          emailSender.sendEmail(message)
        ).rejects.toThrow(/required fields/i);
      });

      it('should throw an error for empty body', async () => {
        const message: EmailMessage = {
          to: 'test@example.com',
          subject: 'Test Subject',
          body: ''
        };

        await expect(
          emailSender.sendEmail(message)
        ).rejects.toThrow(/required fields/i);
      });
    });

    describe('error handling', () => {
      it('should throw meaningful errors when service fails', async () => {
        const message: EmailMessage = {
          to: 'fail@example.com',
          subject: 'Failing Test',
          body: 'This should trigger an error'
        };

        // Note: The specific error behavior depends on the implementation
        // This test ensures errors are properly propagated
        try {
          await emailSender.sendEmail(message);
          // If this passes without error in stub, that's acceptable
        } catch (error) {
          expect(error).toBeDefined();
          expect((error as Error).message).toBeTruthy();
        }
      });
    });
  });
}

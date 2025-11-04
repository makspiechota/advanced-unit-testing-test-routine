import { IEmailSender, EmailMessage, SendEmailResult } from '../email-sender.interface';

/**
 * In-memory stub implementation of IEmailSender for unit testing
 *
 * This implementation simulates email sending without actually sending emails
 * or making HTTP requests. It's used for UNIT tests that test the behavioral
 * contract without external dependencies.
 */
export class EmailSenderStub implements IEmailSender {
  private sentEmails: Array<{ message: EmailMessage; messageId: string }> = [];
  private nextMessageId: number = 1;

  async sendEmail(message: EmailMessage): Promise<SendEmailResult> {
    // Validate required fields (matching real email service behavior)
    if (!message.to || !message.subject || !message.body) {
      throw new Error('Email service error: Missing required fields');
    }

    // Validate email address format
    if (!this.isValidEmail(message.to)) {
      throw new Error('Email service error: Invalid email address');
    }

    // Generate a unique message ID
    const messageId = `stub-msg-${this.nextMessageId++}-${Date.now()}`;

    // Store the sent email for inspection in tests
    this.sentEmails.push({
      message: { ...message },
      messageId
    });

    return { messageId };
  }

  // Helper methods for testing
  getSentEmails(): Array<{ message: EmailMessage; messageId: string }> {
    return [...this.sentEmails];
  }

  getLastSentEmail(): { message: EmailMessage; messageId: string } | undefined {
    return this.sentEmails[this.sentEmails.length - 1];
  }

  clear(): void {
    this.sentEmails = [];
    this.nextMessageId = 1;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

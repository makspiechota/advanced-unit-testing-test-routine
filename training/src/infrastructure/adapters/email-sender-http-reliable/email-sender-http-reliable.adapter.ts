import { IEmailSender, EmailMessage, SendEmailResult } from '../../../application/ports/email-sender/email-sender.interface';
import { EmailServiceReliable } from '../../../library/EmailServiceReliable';

/**
 * HTTP adapter implementation of IEmailSender using EmailServiceReliable
 *
 * This adapter wraps the EmailServiceReliable client from src/library.
 * It connects to the reliable email service on port 3003, which has NO failure rate
 * and is designed for production use.
 *
 * Note: EmailServiceReliable has a different API:
 * - Uses sendMessage(recipient, title, content) instead of sendEmail(to, subject, body)
 * - Returns { id } instead of using void
 *
 * This adapter crosses the memory boundary (HTTP) - tests using this are INTEGRATION tests.
 */
export class EmailSenderHttpReliableAdapter implements IEmailSender {
  private emailServiceReliable: EmailServiceReliable;

  constructor(host: string = 'localhost', port: number = 3003) {
    this.emailServiceReliable = new EmailServiceReliable(host, port);
  }

  async sendEmail(message: EmailMessage): Promise<SendEmailResult> {
    try {
      // Adapt IEmailSender interface to EmailServiceReliable API
      // Map: to -> recipient, subject -> title, body -> content
      const result = await this.emailServiceReliable.sendMessage(
        message.to,      // recipient
        message.subject, // title
        message.body     // content
      );

      // EmailServiceReliable returns { id }, we need to return { messageId }
      return { messageId: result.id };
    } catch (error) {
      throw new Error(`Email service error: ${(error as Error).message}`);
    }
  }
}

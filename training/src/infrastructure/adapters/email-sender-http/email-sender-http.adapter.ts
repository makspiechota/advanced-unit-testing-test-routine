import { IEmailSender, EmailMessage, SendEmailResult } from '../../../application/ports/email-sender/email-sender.interface';
import { EmailService } from '../../../library/EmailService';

/**
 * HTTP adapter implementation of IEmailSender using EmailService (non-reliable)
 *
 * This adapter wraps the EmailService client from src/library.
 * It connects to the email service on port 3002, which has a 30% failure rate.
 *
 * Note: EmailService.sendEmail() returns void, so we generate a client-side messageId
 * since the actual messageId is only logged internally by EmailService.
 *
 * This adapter crosses the memory boundary (HTTP) - tests using this are INTEGRATION tests.
 */
export class EmailSenderHttpAdapter implements IEmailSender {
  private emailService: EmailService;

  constructor(host: string = 'localhost', port: number = 3002) {
    this.emailService = new EmailService(host, port);
  }

  async sendEmail(message: EmailMessage): Promise<SendEmailResult> {
    try {
      // Use the EmailService library client
      await this.emailService.sendEmail(message.to, message.subject, message.body);

      // EmailService returns void, so we generate a client-side messageId
      const messageId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      return { messageId };
    } catch (error) {
      throw new Error(`Email service error: ${(error as Error).message}`);
    }
  }
}

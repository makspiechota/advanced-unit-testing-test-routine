/**
 * EmailService - HTTP client for the email service
 *
 * This service connects to the email HTTP server (port 3002)
 * to send emails.
 */

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class EmailService {
  private baseUrl: string;

  constructor(host: string = 'localhost', port: number = 3002) {
    this.baseUrl = `http://${host}:${port}`;
  }

  /**
   * Send an email
   * @param to - Recipient email address
   * @param subject - Email subject
   * @param body - Email body content
   * @returns Promise that resolves when email is sent
   */
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, body }),
      });

      const result = await response.json() as EmailResponse;

      if (!result.success) {
        throw new Error(result.error || 'Failed to send email');
      }

      console.log(`Email sent successfully: ${result.messageId}`);
    } catch (error) {
      throw new Error(`Email service error: ${(error as Error).message}`);
    }
  }
}

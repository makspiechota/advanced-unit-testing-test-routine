/**
 * EmailServiceReliable - HTTP client for the reliable email service
 *
 * This service connects to the reliable email HTTP server (port 3003)
 * Different API contract with different method signature
 */

interface SendResult {
  sent: boolean;
  id?: string;
  message?: string;
}

export class EmailServiceReliable {
  private baseUrl: string;

  constructor(host: string = 'localhost', port: number = 3003) {
    this.baseUrl = `http://${host}:${port}`;
  }

  /**
   * Send a message (different signature than regular EmailService)
   * @param recipient - Recipient email address
   * @param title - Email title
   * @param content - Email content
   * @returns Promise that resolves with send result
   */
  async sendMessage(recipient: string, title: string, content: string): Promise<{ id: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipient, title, content }),
      });

      const result = await response.json() as SendResult;

      if (!result.sent) {
        throw new Error(result.message || 'Failed to send message');
      }

      console.log(`Message sent successfully: ${result.id}`);

      return { id: result.id! };
    } catch (error) {
      throw new Error(`Reliable email service error: ${(error as Error).message}`);
    }
  }
}

export interface EmailMessage {
  to: string;
  subject: string;
  body: string;
}

export interface SendEmailResult {
  messageId: string;
}

export interface IEmailSender {
  sendEmail(message: EmailMessage): Promise<SendEmailResult>;
}

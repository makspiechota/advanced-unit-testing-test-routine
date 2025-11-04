import express, { Request, Response } from 'express';

const PORT = 3003;
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Different API contract
interface EmailMessage {
  recipient: string;
  title: string;
  content: string;
}

interface SendResult {
  sent: boolean;
  id?: string;
  message?: string;
}

// Store sent emails for debugging/testing
const sentEmails: EmailMessage[] = [];

/**
 * Reliable email service using Express
 * This service ALWAYS succeeds and has NO delays
 * - No random failures
 * - No delays
 * - Different API contract (recipient, title, content)
 */
function sendEmail(request: EmailMessage): SendResult {
  // Validate email request
  if (!request.recipient || !request.title || !request.content) {
    return {
      sent: false,
      message: 'Missing required fields',
    };
  }

  // Simulate email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(request.recipient)) {
    return {
      sent: false,
      message: 'Invalid recipient email address',
    };
  }

  // Store sent email (for debugging/testing)
  sentEmails.push(request);

  // Generate a fake message ID
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  console.log(`  Email sent successfully (id: ${id})`);

  return {
    sent: true,
    id,
  };
}

// POST endpoint for sending emails (different path)
app.post('/sendMessage', async (req: Request, res: Response) => {
  try {
    const emailRequest = req.body as EmailMessage;

    console.log(`Sending email to: ${emailRequest.recipient}`);
    console.log(`Title: ${emailRequest.title}`);

    const result = sendEmail(emailRequest);

    if (result.sent) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      sent: false,
      message: 'Internal server error',
    });
  }
});

// GET endpoint to retrieve sent emails (for debugging)
app.get('/sent', (req: Request, res: Response) => {
  res.json({
    count: sentEmails.length,
    emails: sentEmails,
  });
});

// DELETE endpoint to clear sent emails
app.delete('/sent', (req: Request, res: Response) => {
  const count = sentEmails.length;
  sentEmails.length = 0;
  res.json({
    message: 'Sent emails cleared',
    cleared: count,
  });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'email-reliable' });
});

// Start the server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Reliable Email Service listening on port ${PORT}`);
    console.log('Ready to send emails via HTTP POST /sendMessage');
    console.log('Configuration: No failures, no delays - 100% reliable');
    console.log(`Health check available at: http://localhost:${PORT}/health`);
  });
}

export default app;

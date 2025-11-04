import express, { Request, Response } from 'express';

const PORT = 3002;
const app = express();

// Configuration
const FAILURE_RATE = 0.3; // 30% chance of random failure
const SUCCESS_DELAY_MS = 3000; // 3 seconds delay on success

// Middleware to parse JSON
app.use(express.json());

interface EmailRequest {
  to: string;
  subject: string;
  body: string;
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Store sent emails for debugging/testing
const sentEmails: EmailRequest[] = [];

/**
 * Simple email service using Express
 * Simulates an SMTP server for sending emails
 * - 30% chance of random failure
 * - 3 second delay on success
 */
async function sendEmail(request: EmailRequest): Promise<EmailResponse> {
  // Validate email request
  if (!request.to || !request.subject || !request.body) {
    return {
      success: false,
      error: 'Missing required fields',
    };
  }

  // Simulate email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(request.to)) {
    return {
      success: false,
      error: 'Invalid recipient email address',
    };
  }

  // Simulate random failures (30% chance)
  const randomValue = Math.random();
  if (randomValue < FAILURE_RATE) {
    console.log(`  Simulated random failure (${(randomValue * 100).toFixed(1)}% < ${FAILURE_RATE * 100}%)`);
    return {
      success: false,
      error: 'SMTP server temporarily unavailable',
    };
  }

  // Simulate network delay (3 seconds)
  console.log(`  Sending email (this will take ${SUCCESS_DELAY_MS / 1000} seconds)...`);
  await new Promise(resolve => setTimeout(resolve, SUCCESS_DELAY_MS));

  // Store sent email (for debugging/testing)
  sentEmails.push(request);

  // Generate a fake message ID
  const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  console.log(`  Email sent successfully (messageId: ${messageId})`);

  return {
    success: true,
    messageId,
  };
}

// POST endpoint for sending emails
app.post('/send', async (req: Request, res: Response) => {
  try {
    const emailRequest = req.body as EmailRequest;

    console.log(`Sending email to: ${emailRequest.to}`);
    console.log(`Subject: ${emailRequest.subject}`);

    const result = await sendEmail(emailRequest);

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
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
  res.json({ status: 'ok', service: 'email' });
});

// Start the server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Email Service listening on port ${PORT}`);
    console.log('Ready to send emails via HTTP POST /send');
    console.log(`Configuration:`);
    console.log(`  - Random failure rate: ${FAILURE_RATE * 100}%`);
    console.log(`  - Success delay: ${SUCCESS_DELAY_MS / 1000}s`);
    console.log(`Health check available at: http://localhost:${PORT}/health`);
  });
}

export default app;

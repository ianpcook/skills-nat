/**
 * Mock Resend Email Service
 * 
 * Captures emails instead of sending them.
 * Allows assertions on email content in tests.
 */

export interface MockEmail {
  id: string;
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  sentAt: Date;
}

// Store all "sent" emails for test assertions
export const sentEmails: MockEmail[] = [];

let emailCounter = 0;

/**
 * Reset captured emails between tests.
 */
export function resetSentEmails() {
  sentEmails.length = 0;
  emailCounter = 0;
}

/**
 * Mock send function that captures emails.
 */
export function mockSend(email: {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
}): { id: string } {
  const id = `mock-email-${++emailCounter}`;
  
  sentEmails.push({
    id,
    from: email.from,
    to: email.to,
    subject: email.subject,
    html: email.html,
    text: email.text,
    sentAt: new Date(),
  });
  
  console.log(`[MockResend] Captured email: "${email.subject}" to ${email.to}`);
  
  return { id };
}

/**
 * Mock Resend client for tests.
 */
export class MockResend {
  emails = {
    send: async (email: Parameters<typeof mockSend>[0]) => {
      return mockSend(email);
    },
  };
}

/**
 * Find emails by recipient.
 */
export function findEmailsTo(recipient: string): MockEmail[] {
  return sentEmails.filter((email) => {
    if (Array.isArray(email.to)) {
      return email.to.includes(recipient);
    }
    return email.to === recipient;
  });
}

/**
 * Find emails by subject (partial match).
 */
export function findEmailsBySubject(subjectPart: string): MockEmail[] {
  return sentEmails.filter((email) =>
    email.subject.toLowerCase().includes(subjectPart.toLowerCase())
  );
}

/**
 * Assert that an email was sent with specific properties.
 */
export function assertEmailSent(options: {
  to?: string;
  subject?: string;
  bodyContains?: string;
}): MockEmail | undefined {
  return sentEmails.find((email) => {
    if (options.to) {
      const recipients = Array.isArray(email.to) ? email.to : [email.to];
      if (!recipients.includes(options.to)) return false;
    }
    if (options.subject && !email.subject.includes(options.subject)) {
      return false;
    }
    if (options.bodyContains) {
      const body = email.html || email.text || '';
      if (!body.includes(options.bodyContains)) return false;
    }
    return true;
  });
}

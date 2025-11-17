/**
 * Email Service using SendGrid
 */

import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn('SENDGRID_API_KEY is not defined. Email sending will be disabled.');
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface EmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    content: string;
    filename: string;
    type?: string;
    disposition?: string;
  }>;
}

/**
 * Send email using SendGrid
 */
export async function sendEmail(params: EmailParams): Promise<void> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('Email sending skipped (no API key):', params.subject);
    return;
  }

  const from = params.from || process.env.SENDGRID_FROM_EMAIL || 'noreply@tochigi-platform.com';

  try {
    await sgMail.send({
      to: params.to,
      from,
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo: params.replyTo,
      cc: params.cc,
      bcc: params.bcc,
      attachments: params.attachments,
    });

    console.log(`Email sent successfully to ${Array.isArray(params.to) ? params.to.join(', ') : params.to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Send multiple emails in batch
 */
export async function sendBulkEmails(emails: EmailParams[]): Promise<void> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('Bulk email sending skipped (no API key)');
    return;
  }

  const from = process.env.SENDGRID_FROM_EMAIL || 'noreply@tochigi-platform.com';

  const messages = emails.map((email) => ({
    to: email.to,
    from: email.from || from,
    subject: email.subject,
    html: email.html,
    text: email.text,
    replyTo: email.replyTo,
    cc: email.cc,
    bcc: email.bcc,
    attachments: email.attachments,
  }));

  try {
    await sgMail.send(messages);
    console.log(`Bulk emails sent successfully (${emails.length} emails)`);
  } catch (error) {
    console.error('Error sending bulk emails:', error);
    throw new Error(`Failed to send bulk emails: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize email content to prevent injection
 */
export function sanitizeEmailContent(content: string): string {
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

import { Resend } from 'resend';

// Lazy-initialize Resend client
let resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, emails disabled');
    return null;
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@skillshq.dev';

export interface AdminNotificationParams {
  skillName: string;
  skillSlug: string;
  submissionId: string;
  adminEmails: string[];
}

/**
 * Send notification to admins when a new skill is submitted.
 */
export async function notifyAdminsOfSubmission({
  skillName,
  skillSlug,
  submissionId,
  adminEmails,
}: AdminNotificationParams): Promise<boolean> {
  const client = getResend();
  if (!client) {
    console.log('[EMAIL] Skipping admin notification (Resend not configured)');
    return false;
  }

  if (adminEmails.length === 0) {
    console.log('[EMAIL] No admin emails to notify');
    return false;
  }

  const reviewUrl = `${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}/admin/submissions/${submissionId}`;

  try {
    console.log(`[EMAIL] Sending submission notification to ${adminEmails.length} admin(s)`);

    const { data, error } = await client.emails.send({
      from: FROM_EMAIL,
      to: adminEmails,
      subject: `New Skill Submission: ${skillName}`,
      html: `
        <h2>New Skill Submission</h2>
        <p>A new skill has been submitted for review.</p>
        <table style="margin: 20px 0;">
          <tr>
            <td style="padding: 5px 15px 5px 0; font-weight: bold;">Name:</td>
            <td>${skillName}</td>
          </tr>
          <tr>
            <td style="padding: 5px 15px 5px 0; font-weight: bold;">Slug:</td>
            <td>${skillSlug}</td>
          </tr>
          <tr>
            <td style="padding: 5px 15px 5px 0; font-weight: bold;">ID:</td>
            <td>${submissionId}</td>
          </tr>
        </table>
        <p>
          <a href="${reviewUrl}" style="display: inline-block; padding: 10px 20px; background: #0D0D0D; color: white; text-decoration: none; border-radius: 4px;">
            Review Submission
          </a>
        </p>
      `,
      text: `
New Skill Submission

A new skill has been submitted for review.

Name: ${skillName}
Slug: ${skillSlug}
ID: ${submissionId}

Review it here: ${reviewUrl}
      `.trim(),
    });

    if (error) {
      console.error('[EMAIL] Failed to send notification:', error);
      return false;
    }

    console.log(`[EMAIL] Notification sent successfully, id: ${data?.id}`);
    return true;
  } catch (err) {
    console.error('[EMAIL] Error sending notification:', err);
    return false;
  }
}

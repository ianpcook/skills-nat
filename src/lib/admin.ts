/**
 * Admin access control
 * 
 * Uses ADMIN_EMAILS environment variable to control who can access admin features.
 * Format: comma-separated list of email addresses
 * Example: ADMIN_EMAILS=ian@example.com,admin@example.com
 */

export function getAdminEmails(): string[] {
  const emails = process.env.ADMIN_EMAILS || '';
  return emails
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(e => e.length > 0);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmails = getAdminEmails();
  // If no admin emails configured, deny all (fail secure)
  if (adminEmails.length === 0) return false;
  return adminEmails.includes(email.toLowerCase());
}

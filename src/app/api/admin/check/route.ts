import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// Admin access is controlled via Google OAuth test users in Google Cloud Console.
// Only approved test users can complete authentication, so a valid session = admin.

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const email = session.user.email;
    console.log(`[ADMIN CHECK] Access granted for: ${email}`);

    return NextResponse.json({
      authorized: true,
      email,
    });
  } catch (error) {
    console.error('[ADMIN CHECK] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

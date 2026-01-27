import { NextRequest, NextResponse } from 'next/server';
import { db, submissions, type SubmissionStatus } from '@/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { desc, eq } from 'drizzle-orm';
import { isAdminEmail } from '@/lib/admin';

export async function GET(request: NextRequest) {
  console.log('[ADMIN SUBMISSIONS] Fetching submissions list');

  try {
    // Verify authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      console.log('[ADMIN SUBMISSIONS] Unauthorized - no session');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!isAdminEmail(session.user.email)) {
      console.log(`[ADMIN SUBMISSIONS] Forbidden - not an admin: ${session.user.email}`);
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    console.log(`[ADMIN SUBMISSIONS] Authenticated admin: ${session.user.email}`);

    // Get status filter from query params
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status') as SubmissionStatus | null;

    console.log(`[ADMIN SUBMISSIONS] Status filter: ${statusFilter || 'all'}`);

    if (!db) {
      console.error('[ADMIN SUBMISSIONS] Database not initialized');
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    // Build query with optional status filter
    const baseQuery = db
      .select()
      .from(submissions);

    const results = statusFilter && ['pending', 'approved', 'rejected'].includes(statusFilter)
      ? await baseQuery
          .where(eq(submissions.status, statusFilter))
          .orderBy(desc(submissions.submittedAt))
      : await baseQuery
          .orderBy(desc(submissions.submittedAt));
    console.log(`[ADMIN SUBMISSIONS] Found ${results.length} submissions`);

    return NextResponse.json({
      submissions: results,
      total: results.length,
    });

  } catch (error) {
    console.error('[ADMIN SUBMISSIONS] Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db, submissions, type SubmissionStatus } from '@/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { desc, eq } from 'drizzle-orm';

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

    console.log(`[ADMIN SUBMISSIONS] Authenticated user: ${session.user.email}`);

    // Get status filter from query params
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status') as SubmissionStatus | null;

    console.log(`[ADMIN SUBMISSIONS] Status filter: ${statusFilter || 'all'}`);

    // Build query
    let query = db
      .select()
      .from(submissions)
      .orderBy(desc(submissions.submittedAt));

    if (statusFilter && ['pending', 'approved', 'rejected'].includes(statusFilter)) {
      query = db
        .select()
        .from(submissions)
        .where(eq(submissions.status, statusFilter))
        .orderBy(desc(submissions.submittedAt));
    }

    const results = await query;
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

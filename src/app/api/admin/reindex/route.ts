import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { reindexAllSkills } from '@/lib/skill-indexer';
import { isAdminEmail } from '@/lib/admin';

export async function POST(request: NextRequest) {
  console.log('[ADMIN REINDEX] Reindex request received');

  try {
    // Verify authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      console.log('[ADMIN REINDEX] Unauthorized - no session');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!isAdminEmail(session.user.email)) {
      console.log(`[ADMIN REINDEX] Forbidden - not an admin: ${session.user.email}`);
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    console.log(`[ADMIN REINDEX] Authenticated admin: ${session.user.email}`);

    const result = await reindexAllSkills();

    return NextResponse.json({
      success: true,
      message: `Reindexed ${result.indexed} skills with ${result.errors} errors`,
      ...result,
    });
  } catch (error) {
    console.error('[ADMIN REINDEX] Error:', error);
    return NextResponse.json(
      { error: 'Reindex failed' },
      { status: 500 }
    );
  }
}

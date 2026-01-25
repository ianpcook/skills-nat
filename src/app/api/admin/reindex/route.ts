import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { reindexAllSkills } from '@/lib/skill-indexer';

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

    console.log(`[ADMIN REINDEX] Authenticated user: ${session.user.email}`);

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

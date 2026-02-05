import { NextResponse } from 'next/server';
import { db, skills } from '@/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

const DEFAULT_AGENTS = ['claude-code', 'claude', 'codex', 'openclaw', 'antigravity', 'gemini'];

export async function POST() {
  console.log('[ADMIN SET-DEFAULT-AGENTS] Setting default agents for all skills');

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log(`[ADMIN SET-DEFAULT-AGENTS] Authenticated admin: ${session.user.email}`);

    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    // Fetch all skills with empty or null agents
    const allSkills = await db.select().from(skills);
    console.log(`[ADMIN SET-DEFAULT-AGENTS] Found ${allSkills.length} skills`);

    let updatedCount = 0;

    for (const skill of allSkills) {
      // Update skills with empty agents array
      if (!skill.agents || skill.agents.length === 0) {
        await db
          .update(skills)
          .set({
            agents: DEFAULT_AGENTS,
            updatedAt: new Date(),
          })
          .where(eq(skills.id, skill.id));

        updatedCount++;
        console.log(`[ADMIN SET-DEFAULT-AGENTS] Updated ${skill.slug} with default agents`);
      }
    }

    console.log(`[ADMIN SET-DEFAULT-AGENTS] Complete. Updated ${updatedCount}/${allSkills.length} skills`);

    return NextResponse.json({
      success: true,
      total: allSkills.length,
      updated: updatedCount,
      defaultAgents: DEFAULT_AGENTS,
    });

  } catch (error) {
    console.error('[ADMIN SET-DEFAULT-AGENTS] Error:', error);
    return NextResponse.json(
      { error: 'Failed to set default agents' },
      { status: 500 }
    );
  }
}

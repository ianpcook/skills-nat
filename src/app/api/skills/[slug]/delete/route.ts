import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { skills, skillEmbeddings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// Admin access is controlled via Google OAuth test users.
// Only approved test users can complete authentication, so a valid session = admin.

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

  console.log(`[DELETE] Attempting to delete skill: ${slug}`);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    console.log(`[DELETE] Unauthorized: no session`);
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  console.log(`[DELETE] Authorized admin: ${session.user.email}`);

  if (!db) {
    return NextResponse.json(
      { error: 'Database not available' },
      { status: 503 }
    );
  }

  try {
    // Find the skill first
    const [skill] = await db
      .select()
      .from(skills)
      .where(eq(skills.slug, slug))
      .limit(1);

    if (!skill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    // Delete embeddings first (foreign key constraint)
    await db
      .delete(skillEmbeddings)
      .where(eq(skillEmbeddings.skillId, skill.id));

    // Delete the skill
    await db
      .delete(skills)
      .where(eq(skills.slug, slug));

    console.log(`[DELETE] Successfully deleted skill: ${slug}`);

    return NextResponse.json({
      success: true,
      message: `Skill "${slug}" has been deleted`,
    });

  } catch (error) {
    console.error('[DELETE] Error deleting skill:', error);
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
}

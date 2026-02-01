import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { skills, skillEmbeddings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { isAdminEmail } from '@/lib/admin';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  
  console.log(`[DELETE] Attempting to delete skill: ${slug}`);

  // Admin authentication check
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

  const email = session.user.email;
  
  if (!isAdminEmail(email)) {
    console.log(`[DELETE] Forbidden: ${email} is not an admin`);
    return NextResponse.json(
      { error: 'Not authorized' },
      { status: 403 }
    );
  }

  console.log(`[DELETE] Authorized admin: ${email}`);

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

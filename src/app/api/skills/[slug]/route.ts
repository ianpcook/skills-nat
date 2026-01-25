import { NextRequest, NextResponse } from 'next/server';
import { db, skills } from '@/db';
import { eq, and, isNotNull } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    console.log(`[API] GET /api/skills/${slug}`);

    // Find the skill by slug (only approved skills)
    const [skill] = await db
      .select()
      .from(skills)
      .where(and(eq(skills.slug, slug), isNotNull(skills.approvedAt)))
      .limit(1);

    if (!skill) {
      console.log(`[API] Skill not found: ${slug}`);
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    console.log(`[API] Found skill: ${skill.name}`);
    return NextResponse.json({ skill });
  } catch (error) {
    console.error('[API] Error fetching skill:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { skills, userStars } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  if (!db) {
    return NextResponse.json({ error: "Database not available" }, { status: 500 });
  }

  // Get current user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Must be logged in to vote" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Find the skill
    const [skill] = await db
      .select()
      .from(skills)
      .where(eq(skills.slug, slug))
      .limit(1);

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    // Check if user already voted
    const [existingVote] = await db
      .select()
      .from(userStars)
      .where(and(eq(userStars.userId, userId), eq(userStars.skillId, skill.id)))
      .limit(1);

    if (existingVote) {
      // Remove vote (toggle off)
      await db.delete(userStars).where(eq(userStars.id, existingVote.id));
      
      // Decrement stars count
      await db
        .update(skills)
        .set({ stars: sql`${skills.stars} - 1` })
        .where(eq(skills.id, skill.id));

      return NextResponse.json({ voted: false, stars: skill.stars - 1 });
    } else {
      // Add vote
      await db.insert(userStars).values({
        userId,
        skillId: skill.id,
      });

      // Increment stars count
      await db
        .update(skills)
        .set({ stars: sql`${skills.stars} + 1` })
        .where(eq(skills.id, skill.id));

      return NextResponse.json({ voted: true, stars: skill.stars + 1 });
    }
  } catch (error) {
    console.error("Vote error:", error);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  if (!db) {
    return NextResponse.json({ error: "Database not available" }, { status: 500 });
  }

  // Get current user session (optional for checking vote status)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  try {
    const [skill] = await db
      .select()
      .from(skills)
      .where(eq(skills.slug, slug))
      .limit(1);

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    let voted = false;
    if (session?.user?.id) {
      const [existingVote] = await db
        .select()
        .from(userStars)
        .where(and(eq(userStars.userId, session.user.id), eq(userStars.skillId, skill.id)))
        .limit(1);
      voted = !!existingVote;
    }

    return NextResponse.json({ voted, stars: skill.stars });
  } catch (error) {
    console.error("Get vote status error:", error);
    return NextResponse.json({ error: "Failed to get vote status" }, { status: 500 });
  }
}

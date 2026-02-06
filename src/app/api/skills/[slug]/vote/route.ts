import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { skills, userStars } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

// Anonymous voting: use a voter ID from the client (stored in localStorage)
// No authentication required

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!db) {
    return NextResponse.json({ error: "Database not available" }, { status: 500 });
  }

  // Get anonymous voter ID from request body
  const body = await request.json().catch(() => ({}));
  const voterId = body.voterId;

  if (!voterId || typeof voterId !== "string" || voterId.length < 10) {
    return NextResponse.json({ error: "Invalid voter ID" }, { status: 400 });
  }

  try {
    const [skill] = await db
      .select()
      .from(skills)
      .where(eq(skills.slug, slug))
      .limit(1);

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    // Check if this voter already voted
    const [existingVote] = await db
      .select()
      .from(userStars)
      .where(and(eq(userStars.voterId, voterId), eq(userStars.skillId, skill.id)))
      .limit(1);

    if (existingVote) {
      // Remove vote (toggle off)
      await db.delete(userStars).where(eq(userStars.id, existingVote.id));

      await db
        .update(skills)
        .set({ stars: sql`GREATEST(${skills.stars} - 1, 0)` })
        .where(eq(skills.id, skill.id));

      return NextResponse.json({ voted: false, stars: Math.max(skill.stars - 1, 0) });
    } else {
      // Add vote
      await db.insert(userStars).values({
        voterId,
        skillId: skill.id,
      });

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

  // Get anonymous voter ID from query param
  const voterId = request.nextUrl.searchParams.get("voterId");

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
    if (voterId) {
      const [existingVote] = await db
        .select()
        .from(userStars)
        .where(and(eq(userStars.voterId, voterId), eq(userStars.skillId, skill.id)))
        .limit(1);
      voted = !!existingVote;
    }

    return NextResponse.json({ voted, stars: skill.stars });
  } catch (error) {
    console.error("Get vote status error:", error);
    return NextResponse.json({ error: "Failed to get vote status" }, { status: 500 });
  }
}

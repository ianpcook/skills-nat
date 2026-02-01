import { NextRequest, NextResponse } from 'next/server';
import { db, skills } from '@/db';
import { desc, ilike, eq, or, sql } from 'drizzle-orm';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export async function GET(request: NextRequest) {
  console.log('[SKILLS API] Fetching approved skills');

  // Handle case where database is not available
  if (!db) {
    console.warn('[SKILLS API] Database not available - returning empty result');
    return NextResponse.json({
      skills: [],
      pagination: {
        page: 1,
        limit: DEFAULT_PAGE_SIZE,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
    });
  }

  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_SIZE), 10))
    );
    const offset = (page - 1) * limit;

    // Filters
    const search = searchParams.get('search')?.trim() || null;
    const category = searchParams.get('category')?.trim() || null;
    const agent = searchParams.get('agent')?.trim() || null;
    const sort = searchParams.get('sort')?.trim() || 'stars'; // 'stars' (default) or 'new'
    const featured = searchParams.get('featured') === 'true';

    console.log(`[SKILLS API] Query params: page=${page}, limit=${limit}, search="${search}", category="${category}", agent="${agent}", sort="${sort}", featured=${featured}`);

    // Build where conditions
    const conditions = [];

    // Only return approved skills (those with approvedAt set)
    conditions.push(sql`${skills.approvedAt} IS NOT NULL`);

    if (search) {
      conditions.push(
        or(
          ilike(skills.name, `%${search}%`),
          ilike(skills.description, `%${search}%`),
          ilike(skills.slug, `%${search}%`)
        )
      );
    }

    if (category) {
      conditions.push(eq(skills.category, category));
    }

    if (agent) {
      // Filter skills that have this agent in their agents array (jsonb contains)
      conditions.push(sql`${skills.agents} @> ${JSON.stringify([agent])}::jsonb`);
    }

    if (featured) {
      conditions.push(eq(skills.featured, true));
    }

    // Count total matching skills
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(skills)
      .where(conditions.length > 1 ? sql`${conditions.reduce((a, b) => sql`${a} AND ${b}`)}` : conditions[0]);

    const total = Number(countResult[0]?.count || 0);

    // Fetch skills with pagination
    const whereClause = conditions.length > 1
      ? sql`${conditions.reduce((a, b) => sql`${a} AND ${b}`)}`
      : conditions[0];

    // Determine sort order
    const orderByClause = sort === 'new'
      ? [desc(skills.createdAt), desc(skills.approvedAt)]
      : [desc(skills.stars), desc(skills.approvedAt)];

    const results = await db
      .select()
      .from(skills)
      .where(whereClause)
      .orderBy(...orderByClause)
      .limit(limit)
      .offset(offset);

    console.log(`[SKILLS API] Found ${results.length} skills (total: ${total})`);

    return NextResponse.json({
      skills: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: offset + results.length < total,
      },
    });

  } catch (error) {
    console.error('[SKILLS API] Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

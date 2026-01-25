import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { skills, skillEmbeddings } from '@/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { generateEmbedding } from '@/lib/embeddings';

export async function GET(request: NextRequest) {
  if (!db) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  try {
    console.log(`[SEARCH] Vector search for: "${query}"`);

    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query);

    // Use pgvector's cosine distance operator (<=>)
    // Lower distance = more similar
    const results = await db
      .select({
        skill: skills,
        distance: sql<number>`${skillEmbeddings.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector`,
      })
      .from(skillEmbeddings)
      .innerJoin(skills, eq(skillEmbeddings.skillId, skills.id))
      .orderBy(sql`${skillEmbeddings.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector`)
      .limit(limit);

    console.log(`[SEARCH] Found ${results.length} results`);

    // Transform results - convert distance to similarity score (1 - distance for cosine)
    const skillResults = results.map((r) => ({
      ...r.skill,
      score: 1 - r.distance, // Convert cosine distance to similarity
    }));

    return NextResponse.json({
      query,
      results: skillResults,
      total: skillResults.length,
    });
  } catch (error) {
    console.error('[SEARCH] Error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

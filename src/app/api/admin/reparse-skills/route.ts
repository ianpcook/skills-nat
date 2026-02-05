import { NextResponse } from 'next/server';
import { db, skills, type SubmissionFile } from '@/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

// Parse frontmatter from SKILL.md to extract metadata
const parseFrontmatter = (files: SubmissionFile[]): {
  author?: string;
  category?: string;
  agents?: string[];
  shortDescription?: string;
} => {
  const skillMd = files.find(f => f.name.toLowerCase() === 'skill.md');
  if (!skillMd) return {};

  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = skillMd.content.match(frontmatterRegex);
  if (!match) return {};

  const result: { author?: string; category?: string; agents?: string[]; shortDescription?: string } = {};
  const lines = match[1].split('\n');
  const agents: string[] = [];
  let inAgentsList = false;

  for (const line of lines) {
    // Check if this is a YAML list item (for agents)
    if (inAgentsList && line.match(/^\s+-\s+/)) {
      const agentValue = line.replace(/^\s+-\s+/, '').trim().replace(/^['"]|['"]$/g, '');
      if (agentValue) agents.push(agentValue);
      continue;
    } else if (inAgentsList && !line.match(/^\s+-/)) {
      inAgentsList = false;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim().toLowerCase();
    let value = line.slice(colonIndex + 1).trim();

    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (key === 'author') result.author = value;
    if (key === 'category') result.category = value;
    if (key === 'short_description' || key === 'shortdescription') result.shortDescription = value;
    if (key === 'agents') {
      if (value.startsWith('[') && value.endsWith(']')) {
        const inlineAgents = value.slice(1, -1).split(',').map(a => a.trim().replace(/^['"]|['"]$/g, ''));
        agents.push(...inlineAgents.filter(a => a));
      } else if (!value) {
        inAgentsList = true;
      }
    }
  }

  if (agents.length > 0) result.agents = agents;
  return result;
};

export async function POST() {
  console.log('[ADMIN REPARSE] Starting skill metadata re-parse');

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

    console.log(`[ADMIN REPARSE] Authenticated admin: ${session.user.email}`);

    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    // Fetch all skills
    const allSkills = await db.select().from(skills);
    console.log(`[ADMIN REPARSE] Found ${allSkills.length} skills to process`);

    const results: { slug: string; updated: boolean; metadata: Record<string, unknown> }[] = [];

    for (const skill of allSkills) {
      const metadata = parseFrontmatter(skill.files || []);

      // Only update if we found metadata
      const hasMetadata = metadata.author || metadata.category || (metadata.agents && metadata.agents.length > 0) || metadata.shortDescription;

      if (hasMetadata) {
        await db
          .update(skills)
          .set({
            author: metadata.author || skill.author,
            category: metadata.category || skill.category,
            agents: metadata.agents && metadata.agents.length > 0 ? metadata.agents : skill.agents,
            shortDescription: metadata.shortDescription || skill.shortDescription,
            updatedAt: new Date(),
          })
          .where(eq(skills.id, skill.id));

        results.push({
          slug: skill.slug,
          updated: true,
          metadata,
        });

        console.log(`[ADMIN REPARSE] Updated ${skill.slug}:`, metadata);
      } else {
        results.push({
          slug: skill.slug,
          updated: false,
          metadata: {},
        });
        console.log(`[ADMIN REPARSE] No metadata found for ${skill.slug}`);
      }
    }

    const updatedCount = results.filter(r => r.updated).length;
    console.log(`[ADMIN REPARSE] Complete. Updated ${updatedCount}/${allSkills.length} skills`);

    return NextResponse.json({
      success: true,
      total: allSkills.length,
      updated: updatedCount,
      results,
    });

  } catch (error) {
    console.error('[ADMIN REPARSE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to re-parse skills' },
      { status: 500 }
    );
  }
}

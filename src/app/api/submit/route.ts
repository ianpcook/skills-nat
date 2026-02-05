import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { submissions, admins, type SubmissionFile } from '@/db/schema';
import { notifyAdminsOfSubmission } from '@/lib/email';

interface SkillFrontmatter {
  name?: string;
  description?: string;
  version?: string;
  author?: string;
  category?: string;
  agents?: string[];
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

const parseFrontmatter = (content: string): SkillFrontmatter => {
  console.log('[SUBMIT] Parsing SKILL.md frontmatter');
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    console.log('[SUBMIT] No frontmatter found in SKILL.md');
    return {};
  }

  const frontmatter: SkillFrontmatter = {};
  const frontmatterText = match[1];
  const lines = frontmatterText.split('\n');

  let currentKey: string | null = null;
  let inAgentsList = false;
  const agents: string[] = [];

  for (const line of lines) {
    // Check if this is a YAML list item (for agents)
    if (inAgentsList && line.match(/^\s+-\s+/)) {
      const agentValue = line.replace(/^\s+-\s+/, '').trim();
      if (agentValue) {
        agents.push(agentValue.replace(/^['"]|['"]$/g, ''));
      }
      continue;
    } else if (inAgentsList && !line.match(/^\s+-/)) {
      // End of agents list
      inAgentsList = false;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim().toLowerCase();
    let value = line.slice(colonIndex + 1).trim();

    // Remove surrounding quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    currentKey = key;

    if (key === 'name') frontmatter.name = value;
    if (key === 'description') frontmatter.description = value;
    if (key === 'version') frontmatter.version = value;
    if (key === 'author') frontmatter.author = value;
    if (key === 'category') frontmatter.category = value;
    if (key === 'agents') {
      // Check if it's an inline array like [claude-code, cursor]
      if (value.startsWith('[') && value.endsWith(']')) {
        const inlineAgents = value.slice(1, -1).split(',').map(a => a.trim().replace(/^['"]|['"]$/g, ''));
        agents.push(...inlineAgents.filter(a => a));
      } else if (!value) {
        // It's a YAML list starting on the next line
        inAgentsList = true;
      }
    }
  }

  if (agents.length > 0) {
    frontmatter.agents = agents;
  }

  console.log('[SUBMIT] Parsed frontmatter:', frontmatter);
  return frontmatter;
};

export async function POST(request: NextRequest) {
  console.log('[SUBMIT] Received submission request');

  // Handle case where database is not available
  if (!db) {
    console.warn('[SUBMIT] Database not available');
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const files: SubmissionFile[] = [];
    let skillMdContent: string | null = null;

    // Process all uploaded files
    const entries = Array.from(formData.entries());
    console.log(`[SUBMIT] Processing ${entries.length} form entries`);

    for (const [key, value] of entries) {
      if (value instanceof File) {
        console.log(`[SUBMIT] Processing file: ${value.name} (${value.size} bytes)`);
        const content = await value.text();

        files.push({
          name: value.name,
          content,
          size: value.size,
        });

        if (value.name.toLowerCase() === 'skill.md') {
          skillMdContent = content;
        }
      }
    }

    // Validate SKILL.md is present
    if (!skillMdContent) {
      console.log('[SUBMIT] Error: SKILL.md not found in submission');
      return NextResponse.json(
        { error: 'SKILL.md file is required' },
        { status: 400 }
      );
    }

    if (files.length === 0) {
      console.log('[SUBMIT] Error: No files in submission');
      return NextResponse.json(
        { error: 'At least one file is required' },
        { status: 400 }
      );
    }

    // Parse frontmatter from SKILL.md
    const frontmatter = parseFrontmatter(skillMdContent);

    const name = frontmatter.name || 'Unnamed Skill';
    const slug = generateSlug(name);
    const version = frontmatter.version || '1.0.0';
    const description = frontmatter.description || null;

    console.log(`[SUBMIT] Creating submission: name="${name}", slug="${slug}", version="${version}"`);

    // Insert into database
    const [submission] = await db
      .insert(submissions)
      .values({
        slug,
        name,
        version,
        description,
        files,
        status: 'pending',
      })
      .returning();

    console.log(`[SUBMIT] Submission created with id: ${submission.id}`);

    // Notify admins (don't await - fire and forget)
    (async () => {
      try {
        const adminList = await db.select({ email: admins.email }).from(admins);
        const adminEmails = adminList.map(a => a.email);
        
        if (adminEmails.length > 0) {
          await notifyAdminsOfSubmission({
            skillName: name,
            skillSlug: slug,
            submissionId: submission.id,
            adminEmails,
          });
        }
      } catch (err) {
        console.error('[SUBMIT] Failed to notify admins:', err);
      }
    })();

    return NextResponse.json({
      success: true,
      id: submission.id,
      message: 'Submission received and pending review',
    });

  } catch (error) {
    console.error('[SUBMIT] Error processing submission:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}

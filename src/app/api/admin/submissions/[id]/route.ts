import { NextRequest, NextResponse } from 'next/server';
import { db, submissions, skills, type SubmissionStatus, type SubmissionFile } from '@/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { indexSkill } from '@/lib/skill-indexer';
import { publishSkillToGitHub } from '@/lib/github-publisher';

const DEFAULT_AGENTS = ['claude-code', 'claude', 'codex', 'openclaw', 'antigravity', 'gemini'];

// Parse frontmatter from SKILL.md to extract metadata
const parseFrontmatter = (files: SubmissionFile[]): { author?: string; category?: string; agents?: string[]; shortDescription?: string } => {
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

// Admin access is controlled via Google OAuth test users.
// Only approved test users can complete authentication, so a valid session = admin.

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  console.log(`[ADMIN SUBMISSION] Fetching submission: ${id}`);

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      console.log('[ADMIN SUBMISSION] Unauthorized - no session');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log(`[ADMIN SUBMISSION] Authenticated admin: ${session.user.email}`);

    if (!db) {
      console.error('[ADMIN SUBMISSION] Database not initialized');
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    // Fetch submission
    const [submission] = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, id))
      .limit(1);

    if (!submission) {
      console.log(`[ADMIN SUBMISSION] Submission not found: ${id}`);
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    console.log(`[ADMIN SUBMISSION] Found submission: ${submission.name}`);

    return NextResponse.json({ submission });

  } catch (error) {
    console.error('[ADMIN SUBMISSION] Error fetching submission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  console.log(`[ADMIN SUBMISSION] Updating submission: ${id}`);

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      console.log('[ADMIN SUBMISSION] Unauthorized - no session');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log(`[ADMIN SUBMISSION] Authenticated admin: ${session.user.email}`);

    if (!db) {
      console.error('[ADMIN SUBMISSION] Database not initialized');
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { status, reviewerNotes } = body as {
      status?: SubmissionStatus;
      reviewerNotes?: string;
    };

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      console.log(`[ADMIN SUBMISSION] Invalid status: ${status}`);
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Fetch existing submission
    const [existingSubmission] = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, id))
      .limit(1);

    if (!existingSubmission) {
      console.log(`[ADMIN SUBMISSION] Submission not found: ${id}`);
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    console.log(`[ADMIN SUBMISSION] Updating status from "${existingSubmission.status}" to "${status}"`);

    // Update submission
    const [updatedSubmission] = await db
      .update(submissions)
      .set({
        status,
        reviewerNotes: reviewerNotes || null,
        reviewedAt: new Date(),
      })
      .where(eq(submissions.id, id))
      .returning();

    // If approved, create a skill entry
    if (status === 'approved') {
      console.log('[ADMIN SUBMISSION] Creating skill from approved submission');

      // Parse additional metadata from SKILL.md frontmatter
      const metadata = parseFrontmatter(existingSubmission.files);
      console.log('[ADMIN SUBMISSION] Parsed metadata:', metadata);

      // Check if skill with same slug already exists
      const [existingSkill] = await db
        .select()
        .from(skills)
        .where(eq(skills.slug, existingSubmission.slug))
        .limit(1);

      if (existingSkill) {
        // Update existing skill
        console.log(`[ADMIN SUBMISSION] Updating existing skill: ${existingSkill.id}`);
        const [updatedSkill] = await db
          .update(skills)
          .set({
            name: existingSubmission.name,
            version: existingSubmission.version,
            description: existingSubmission.description,
            shortDescription: metadata.shortDescription || null,
            files: existingSubmission.files,
            author: metadata.author || null,
            category: metadata.category || null,
            agents: metadata.agents || DEFAULT_AGENTS,
            submissionId: existingSubmission.id,
            approvedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(skills.id, existingSkill.id))
          .returning();

        // Index for vector search
        try {
          await indexSkill(updatedSkill);
        } catch (indexError) {
          console.error('[ADMIN SUBMISSION] Failed to index skill:', indexError);
          // Don't fail the approval if indexing fails
        }

        // Publish to GitHub repository
        try {
          const publishResult = await publishSkillToGitHub(updatedSkill.slug, existingSubmission.files);
          if (!publishResult.success) {
            console.warn('[ADMIN SUBMISSION] GitHub publish incomplete:', publishResult.error);
          }
        } catch (publishError) {
          console.error('[ADMIN SUBMISSION] Failed to publish to GitHub:', publishError);
          // Don't fail the approval if publishing fails
        }
      } else {
        // Create new skill
        const [newSkill] = await db
          .insert(skills)
          .values({
            slug: existingSubmission.slug,
            name: existingSubmission.name,
            version: existingSubmission.version,
            description: existingSubmission.description,
            shortDescription: metadata.shortDescription || null,
            files: existingSubmission.files,
            author: metadata.author || null,
            category: metadata.category || null,
            agents: metadata.agents || DEFAULT_AGENTS,
            submissionId: existingSubmission.id,
            approvedAt: new Date(),
          })
          .returning();

        console.log(`[ADMIN SUBMISSION] Created skill: ${newSkill.id}`);

        // Index for vector search
        try {
          await indexSkill(newSkill);
        } catch (indexError) {
          console.error('[ADMIN SUBMISSION] Failed to index skill:', indexError);
          // Don't fail the approval if indexing fails
        }

        // Publish to GitHub repository
        try {
          const publishResult = await publishSkillToGitHub(newSkill.slug, existingSubmission.files);
          if (!publishResult.success) {
            console.warn('[ADMIN SUBMISSION] GitHub publish incomplete:', publishResult.error);
          }
        } catch (publishError) {
          console.error('[ADMIN SUBMISSION] Failed to publish to GitHub:', publishError);
          // Don't fail the approval if publishing fails
        }
      }
    }

    console.log(`[ADMIN SUBMISSION] Submission updated successfully`);

    return NextResponse.json({
      success: true,
      submission: updatedSubmission,
    });

  } catch (error) {
    console.error('[ADMIN SUBMISSION] Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  console.log(`[ADMIN SUBMISSION] Deleting submission: ${id}`);

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      console.log('[ADMIN SUBMISSION] Unauthorized - no session');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log(`[ADMIN SUBMISSION] Authenticated admin: ${session.user.email}`);

    if (!db) {
      console.error('[ADMIN SUBMISSION] Database not initialized');
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    // Fetch submission first to check if it exists
    const [existingSubmission] = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, id))
      .limit(1);

    if (!existingSubmission) {
      console.log(`[ADMIN SUBMISSION] Submission not found: ${id}`);
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Delete the submission
    await db
      .delete(submissions)
      .where(eq(submissions.id, id));

    console.log(`[ADMIN SUBMISSION] Submission deleted: ${existingSubmission.name}`);

    return NextResponse.json({
      success: true,
      message: `Submission "${existingSubmission.name}" deleted`,
    });

  } catch (error) {
    console.error('[ADMIN SUBMISSION] Error deleting submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete submission' },
      { status: 500 }
    );
  }
}

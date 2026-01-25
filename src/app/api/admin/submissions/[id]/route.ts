import { NextRequest, NextResponse } from 'next/server';
import { db, submissions, skills, type SubmissionStatus } from '@/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  console.log(`[ADMIN SUBMISSION] Fetching submission: ${id}`);

  try {
    // Verify authentication
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

    console.log(`[ADMIN SUBMISSION] Authenticated user: ${session.user.email}`);

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
    // Verify authentication
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

    console.log(`[ADMIN SUBMISSION] Authenticated user: ${session.user.email}`);

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

      // Check if skill with same slug already exists
      const [existingSkill] = await db
        .select()
        .from(skills)
        .where(eq(skills.slug, existingSubmission.slug))
        .limit(1);

      if (existingSkill) {
        // Update existing skill
        console.log(`[ADMIN SUBMISSION] Updating existing skill: ${existingSkill.id}`);
        await db
          .update(skills)
          .set({
            name: existingSubmission.name,
            version: existingSubmission.version,
            description: existingSubmission.description,
            files: existingSubmission.files,
            submissionId: existingSubmission.id,
            approvedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(skills.id, existingSkill.id));
      } else {
        // Create new skill
        const [newSkill] = await db
          .insert(skills)
          .values({
            slug: existingSubmission.slug,
            name: existingSubmission.name,
            version: existingSubmission.version,
            description: existingSubmission.description,
            files: existingSubmission.files,
            submissionId: existingSubmission.id,
            approvedAt: new Date(),
          })
          .returning();

        console.log(`[ADMIN SUBMISSION] Created skill: ${newSkill.id}`);
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

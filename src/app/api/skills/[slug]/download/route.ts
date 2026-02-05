import { NextRequest, NextResponse } from 'next/server';
import { db, skills } from '@/db';
import { eq, and, isNotNull } from 'drizzle-orm';
import JSZip from 'jszip';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!db) {
    return NextResponse.json(
      { error: 'Database not available' },
      { status: 503 }
    );
  }

  try {
    const { slug } = await params;

    // Find the skill by slug (only approved skills)
    const [skill] = await db
      .select()
      .from(skills)
      .where(and(eq(skills.slug, slug), isNotNull(skills.approvedAt)))
      .limit(1);

    if (!skill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    // Create a zip file containing all skill files
    const zip = new JSZip();

    // Add each file to the zip
    if (skill.files && Array.isArray(skill.files)) {
      for (const file of skill.files) {
        if (file.name && file.content) {
          zip.file(file.name, file.content);
        }
      }
    }

    // Generate the zip file as blob
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    // Return the zip file
    return new Response(zipBlob, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${skill.slug}.zip"`,
      },
    });
  } catch (error) {
    console.error('[API] Error generating zip:', error);
    return NextResponse.json(
      { error: 'Failed to generate download' },
      { status: 500 }
    );
  }
}

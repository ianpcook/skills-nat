import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { submissions, admins, type SubmissionFile } from '@/db/schema';
import { notifyAdminsOfSubmission } from '@/lib/email';
import yaml from 'js-yaml';
import { scanSubmission, type ScanResult } from '@/lib/security-scanner';

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

  try {
    const parsed = yaml.load(match[1]) as Record<string, unknown>;
    const frontmatter: SkillFrontmatter = {};
    
    if (typeof parsed.name === 'string') frontmatter.name = parsed.name;
    if (typeof parsed.description === 'string') frontmatter.description = parsed.description.trim();
    if (typeof parsed.version === 'string') frontmatter.version = parsed.version;
    if (typeof parsed.author === 'string') frontmatter.author = parsed.author;
    if (typeof parsed.category === 'string') frontmatter.category = parsed.category;
    if (Array.isArray(parsed.agents)) {
      frontmatter.agents = parsed.agents.filter((a): a is string => typeof a === 'string');
    }
    
    console.log('[SUBMIT] Parsed frontmatter:', frontmatter);
    return frontmatter;
  } catch (err) {
    console.error('[SUBMIT] YAML parse error:', err);
    return {};
  }
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
    const repoUrl = (formData.get('repoUrl') as string | null)?.trim() || null;

    if (repoUrl) {
      console.log(`[SUBMIT] Repository URL provided: ${repoUrl}`);
    }

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

    // ── Security Scan ──
    console.log(`[SUBMIT] Running security scan on ${files.length} files`);
    let scanResult: ScanResult;
    try {
      scanResult = await scanSubmission(
        files.map((f) => ({ name: f.name, content: f.content })),
      );
      console.log(
        `[SUBMIT] Scan complete: ${scanResult.passed ? 'PASSED' : 'FLAGGED'} — ${scanResult.findings.length} finding(s) in ${scanResult.scanDurationMs}ms`,
      );
    } catch (err) {
      console.error('[SUBMIT] Security scan error:', err);
      scanResult = {
        passed: true,
        findings: [],
        scannedFiles: files.length,
        scanDurationMs: 0,
      };
    }

    const scanStatus = scanResult.findings.some((f) => f.severity === 'critical')
      ? 'flagged'
      : 'passed';

    console.log(`[SUBMIT] Creating submission: name="${name}", slug="${slug}", version="${version}", scanStatus="${scanStatus}"`);

    // Insert into database
    const [submission] = await db
      .insert(submissions)
      .values({
        slug,
        name,
        version,
        description,
        files,
        repoUrl,
        status: 'pending',
        scanStatus,
        scanResults: scanResult as unknown as Record<string, unknown>,
        scanDurationMs: scanResult.scanDurationMs,
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
      scan: {
        status: scanStatus,
        passed: scanResult.passed,
        findings: scanResult.findings,
        scannedFiles: scanResult.scannedFiles,
        durationMs: scanResult.scanDurationMs,
      },
    });

  } catch (error) {
    console.error('[SUBMIT] Error processing submission:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}

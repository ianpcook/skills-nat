import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Download, FileText, Code } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DeleteSkillButton } from '@/components/delete-skill-button';
import { VoteButton } from '@/components/vote-button';
import { CopyButton } from '@/components/copy-button';
import { getAgentName, getAgentColor } from '@/lib/constants';
import { db, skills } from '@/db';
import { eq, and, isNotNull } from 'drizzle-orm';
import type { Skill, SubmissionFile } from '@/db/schema';

interface SkillDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getSkill(slug: string): Promise<Skill | null> {
  if (!db) {
    return null;
  }

  try {
    const [skill] = await db
      .select()
      .from(skills)
      .where(and(eq(skills.slug, slug), isNotNull(skills.approvedAt)))
      .limit(1);

    return skill || null;
  } catch (error) {
    console.error('Error fetching skill:', error);
    return null;
  }
}

function FileIcon({ filename }: { filename: string }) {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['md', 'txt'].includes(ext || '')) {
    return <FileText className="h-4 w-4" />;
  }
  return <Code className="h-4 w-4" />;
}


export default async function SkillDetailPage({ params }: SkillDetailPageProps) {
  const { slug } = await params;
  const skill = await getSkill(slug);

  if (!skill) {
    notFound();
  }

  const agentDisplayInfo = skill.agents.map((agentId) => ({
    id: agentId,
    name: getAgentName(agentId),
    color: getAgentColor(agentId),
  }));

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Back Link */}
          <Link
            href="/skills"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase text-foreground border-2 border-foreground px-3 py-1 hover:bg-pop-yellow transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Skills
          </Link>

          {/* Skill Header - Pop Art Style */}
          <div className="mb-10 border-b-4 border-foreground pb-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-foreground mb-2">{skill.name}</h1>
                <p className="mb-4 text-muted-foreground">
                  by <span className="font-bold text-foreground">{skill.author || 'Unknown'}</span>
                </p>
                <p className="text-lg text-foreground/80 max-w-2xl">
                  {skill.description || 'No description available'}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <VoteButton slug={skill.slug} initialStars={skill.stars} />
                  <Badge className="border-2 border-foreground bg-pop-lime text-foreground font-bold">
                    {skill.version}
                  </Badge>
                </div>

                {/* Install Command - Pop Art Terminal */}
                <div className="mt-2 border-4 border-foreground shadow-[4px_4px_0_0_theme(colors.foreground)]">
                  <div className="bg-foreground px-3 py-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-pop-pink" />
                    <span className="w-3 h-3 bg-pop-yellow" />
                    <span className="w-3 h-3 bg-pop-lime" />
                  </div>
                  <div className="bg-foreground text-card p-4 flex items-center justify-between gap-4">
                    <code className="text-sm font-mono">
                      <span className="text-pop-yellow">$</span> npx skills add {skill.author || 'community'}/{skill.slug}
                    </code>
                    <CopyButton
                      content={`npx skills add ${skill.author || 'community'}/${skill.slug}`}
                      label="install command"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            {/* Main Content - Files */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-black uppercase text-foreground mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-pop-pink" />
                Files
              </h2>

              {skill.files && skill.files.length > 0 ? (
                <div className="space-y-4">
                  {skill.files.map((file: SubmissionFile) => (
                    <div
                      key={file.name}
                      className="border-4 border-foreground bg-card overflow-hidden shadow-[4px_4px_0_0_theme(colors.foreground)]"
                    >
                      <div className="flex items-center justify-between border-b-2 border-foreground bg-pop-yellow px-4 py-3">
                        <div className="flex items-center gap-3">
                          <FileIcon filename={file.name} />
                          <span className="font-mono text-sm font-bold text-foreground">
                            {file.name}
                          </span>
                          {file.name.toLowerCase() === 'skill.md' && (
                            <Badge className="bg-pop-pink text-foreground border-2 border-foreground font-bold">
                              Main
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-foreground">
                            {file.size < 1024
                              ? `${file.size} B`
                              : `${(file.size / 1024).toFixed(1)} KB`}
                          </span>
                          <CopyButton content={file.content} label={file.name} />
                        </div>
                      </div>
                      <div className="max-h-96 overflow-auto bg-foreground p-4">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-card">
                          {file.content}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-4 border-foreground bg-card p-8 text-center shadow-[4px_4px_0_0_theme(colors.foreground)]">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-foreground" />
                  <p className="font-bold text-foreground">No files available</p>
                </div>
              )}
            </div>

            {/* Sidebar - Details */}
            <div className="space-y-6">
              {/* Agents */}
              <div className="border-4 border-foreground bg-pop-cyan p-6 shadow-[4px_4px_0_0_theme(colors.foreground)]">
                <h3 className="mb-4 text-lg font-black uppercase text-foreground">
                  Compatible Agents
                </h3>
                <div className="flex flex-wrap gap-2">
                  {agentDisplayInfo.map((agent) => (
                    <Badge
                      key={agent.id}
                      className="border-2 border-foreground bg-card text-foreground font-bold"
                      style={{ borderLeftColor: agent.color, borderLeftWidth: 4 }}
                    >
                      {agent.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="border-4 border-foreground bg-card p-6 shadow-[4px_4px_0_0_theme(colors.foreground)]">
                <h3 className="mb-4 text-lg font-black uppercase text-foreground">
                  Details
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between border-b-2 border-foreground/20 pb-2">
                    <dt className="font-bold uppercase text-muted-foreground">Category</dt>
                    <dd className="font-bold text-foreground">
                      {skill.category || 'Uncategorized'}
                    </dd>
                  </div>
                  <div className="flex justify-between border-b-2 border-foreground/20 pb-2">
                    <dt className="font-bold uppercase text-muted-foreground">Version</dt>
                    <dd className="font-bold text-foreground">{skill.version}</dd>
                  </div>
                  <div className="flex justify-between border-b-2 border-foreground/20 pb-2">
                    <dt className="font-bold uppercase text-muted-foreground">Stars</dt>
                    <dd className="font-bold text-foreground">{skill.stars}</dd>
                  </div>
                  <div className="flex justify-between border-b-2 border-foreground/20 pb-2">
                    <dt className="font-bold uppercase text-muted-foreground">Added</dt>
                    <dd className="font-bold text-foreground">
                      {formatDate(skill.approvedAt)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-bold uppercase text-muted-foreground">Updated</dt>
                    <dd className="font-bold text-foreground">
                      {formatDate(skill.updatedAt)}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Actions */}
              <div className="border-4 border-foreground bg-pop-yellow p-6 shadow-[4px_4px_0_0_theme(colors.foreground)]">
                <h3 className="mb-4 text-lg font-black uppercase text-foreground">
                  Actions
                </h3>
                <div className="space-y-3">
                  <a
                    href={`/api/skills/${skill.slug}/download`}
                    download={`${skill.slug}.zip`}
                    className="w-full flex items-center justify-start gap-2 border-2 border-foreground bg-pop-lime px-4 py-2 font-bold uppercase text-foreground hover:bg-pop-cyan transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download .zip
                  </a>
                  <p className="text-xs text-foreground/70">
                    Upload this .zip to Claude Desktop via Settings → Capabilities → Skills
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-sm font-bold uppercase text-foreground">Vote:</span>
                    <VoteButton slug={skill.slug} initialStars={skill.stars} size="sm" />
                  </div>
                  <DeleteSkillButton slug={skill.slug} skillName={skill.name} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

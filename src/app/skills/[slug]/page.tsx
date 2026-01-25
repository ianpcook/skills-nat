import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Star, Copy, Download, FileText, Code, Clock } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAgentName, getAgentColor } from '@/lib/constants';
import type { Skill, SubmissionFile } from '@/db/schema';

interface SkillDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getSkill(slug: string): Promise<Skill | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/skills/${slug}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch skill');
    }

    const data = await res.json();
    return data.skill;
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

function CopyButton({ content, label }: { content: string; label: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(content)}
      className="flex items-center gap-1 text-xs text-foreground/60 transition-colors hover:text-foreground"
      title={`Copy ${label}`}
    >
      <Copy className="h-3 w-3" />
      Copy
    </button>
  );
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

      <main className="section">
        <div className="section-inner">
          {/* Back Link */}
          <Link
            href="/skills"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Skills
          </Link>

          {/* Skill Header */}
          <div className="mb-10 border-b border-foreground/10 pb-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h1 className="section-title-lg mb-2">{skill.name}</h1>
                <p className="mb-4 text-foreground/70">
                  by <span className="font-medium text-foreground">{skill.author || 'Unknown'}</span>
                </p>
                <p className="body-text max-w-2xl">
                  {skill.description || 'No description available'}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-foreground/70">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="font-medium">{skill.stars}</span>
                  </div>
                  <Badge variant="outline" className="border-foreground/20 text-foreground">
                    {skill.version}
                  </Badge>
                </div>

                {/* Install Command */}
                <div className="terminal mt-2">
                  <div className="terminal-header">
                    <span className="terminal-dot bg-red-500" />
                    <span className="terminal-dot bg-yellow-500" />
                    <span className="terminal-dot bg-green-500" />
                  </div>
                  <div className="terminal-content flex items-center justify-between gap-4">
                    <code className="text-sm">
                      npx skills add {skill.author || 'community'}/{skill.slug}
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
              <h2 className="section-title mb-6">Files</h2>

              {skill.files && skill.files.length > 0 ? (
                <div className="space-y-4">
                  {skill.files.map((file: SubmissionFile) => (
                    <div
                      key={file.name}
                      className="border border-foreground/20 bg-card"
                    >
                      <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <FileIcon filename={file.name} />
                          <span className="font-mono text-sm font-medium text-card-foreground">
                            {file.name}
                          </span>
                          {file.name.toLowerCase() === 'skill.md' && (
                            <Badge className="border-foreground bg-foreground text-background">
                              Main
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-foreground/50">
                            {file.size < 1024
                              ? `${file.size} B`
                              : `${(file.size / 1024).toFixed(1)} KB`}
                          </span>
                          <CopyButton content={file.content} label={file.name} />
                        </div>
                      </div>
                      <div className="max-h-96 overflow-auto bg-foreground/5 p-4">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-card-foreground">
                          {file.content}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-foreground/20 bg-card p-8 text-center">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-foreground/30" />
                  <p className="text-foreground/60">No files available</p>
                </div>
              )}
            </div>

            {/* Sidebar - Details */}
            <div className="space-y-6">
              {/* Agents */}
              <div className="border border-foreground/20 bg-card p-6">
                <h3 className="mb-4 font-serif text-lg font-semibold text-card-foreground">
                  Compatible Agents
                </h3>
                <div className="flex flex-wrap gap-2">
                  {agentDisplayInfo.map((agent) => (
                    <Badge
                      key={agent.id}
                      variant="outline"
                      className="border-foreground/20 bg-background text-foreground"
                      style={{ borderLeftColor: agent.color, borderLeftWidth: 3 }}
                    >
                      {agent.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="border border-foreground/20 bg-card p-6">
                <h3 className="mb-4 font-serif text-lg font-semibold text-card-foreground">
                  Details
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-foreground/60">Category</dt>
                    <dd className="font-medium text-card-foreground">
                      {skill.category || 'Uncategorized'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-foreground/60">Version</dt>
                    <dd className="font-medium text-card-foreground">{skill.version}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-foreground/60">Stars</dt>
                    <dd className="font-medium text-card-foreground">{skill.stars}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-foreground/60">Added</dt>
                    <dd className="font-medium text-card-foreground">
                      {formatDate(skill.approvedAt)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-foreground/60">Updated</dt>
                    <dd className="font-medium text-card-foreground">
                      {formatDate(skill.updatedAt)}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Actions */}
              <div className="border border-foreground/20 bg-card p-6">
                <h3 className="mb-4 font-serif text-lg font-semibold text-card-foreground">
                  Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-foreground/20"
                    onClick={() => {
                      // Download all files as a zip (future feature)
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Download Files
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-foreground/20"
                  >
                    <Star className="h-4 w-4" />
                    Star This Skill
                  </Button>
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

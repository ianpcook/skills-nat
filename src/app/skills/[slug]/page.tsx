import Link from 'next/link';
import { notFound } from 'next/navigation';
import skillsData from '@/data/skills.json';
import { Skill } from '@/types';
import AgentBadge from '@/components/AgentBadge';

interface SkillPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return (skillsData.skills as Skill[]).map((skill) => ({
    slug: skill.slug,
  }));
}

export async function generateMetadata({ params }: SkillPageProps) {
  const { slug } = await params;
  const skill = (skillsData.skills as Skill[]).find((s) => s.slug === slug);
  if (!skill) return { title: 'Skill Not Found' };

  return {
    title: `${skill.name} - AI@Skills`,
    description: skill.description,
  };
}

export default async function SkillPage({ params }: SkillPageProps) {
  const { slug } = await params;
  const skill = (skillsData.skills as Skill[]).find((s) => s.slug === slug);

  if (!skill) {
    notFound();
  }

  const relatedSkills = (skillsData.skills as Skill[])
    .filter((s) => s.category === skill.category && s.id !== skill.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/skills" className="text-[#bfbfbf] hover:text-[#f5f0e6] transition-colors">
                Skills
              </Link>
            </li>
            <li className="text-[#807c73]">/</li>
            <li className="text-[#f5f0e6]">{skill.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-[#1d1e1f] border border-[#2a2520] rounded-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{skill.name}</h1>
                  <p className="text-[#bfbfbf]">
                    by{' '}
                    <a
                      href={skill.authorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#ffbc20] hover:text-[#ffd980] transition-colors"
                    >
                      {skill.author}
                    </a>
                  </p>
                </div>
                {skill.featured && (
                  <span className="px-3 py-1 bg-gradient-to-r from-[#ffbc20] to-[#ffd980] rounded-full text-sm font-medium text-[#1a160d]">
                    Featured
                  </span>
                )}
              </div>

              <p className="text-[#e4e4e7] text-lg leading-relaxed mb-6">
                {skill.description}
              </p>

              {/* Install Command */}
              <div className="bg-[#1a160d] border border-[#2a2520] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#807c73]">Install</span>
                  <button className="text-xs text-[#ffbc20] hover:text-[#ffd980] transition-colors">
                    Copy
                  </button>
                </div>
                <code className="text-sm text-[#ffd980] font-mono">
                  npx skills add {skill.author}/{skill.slug}
                </code>
              </div>
            </div>

            {/* Supported Agents */}
            <div className="bg-[#1d1e1f] border border-[#2a2520] rounded-2xl p-8">
              <h2 className="text-xl font-semibold mb-4">Supported Agents</h2>
              <div className="flex flex-wrap gap-3">
                {skill.agents.map((agentId) => (
                  <AgentBadge key={agentId} agentId={agentId} size="md" />
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-[#1d1e1f] border border-[#2a2520] rounded-2xl p-8">
              <h2 className="text-xl font-semibold mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/skills?q=${encodeURIComponent(tag)}`}
                    className="px-3 py-1.5 bg-[#2a2520] hover:bg-[#3a3530] rounded-lg text-sm text-[#bfbfbf] transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Skills */}
            {relatedSkills.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Related Skills</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {relatedSkills.map((related) => (
                    <Link
                      key={related.id}
                      href={`/skills/${related.slug}`}
                      className="bg-[#1d1e1f] border border-[#2a2520] rounded-xl p-4 hover:border-[#ffbc20]/50 transition-colors"
                    >
                      <h3 className="font-medium mb-1">{related.name}</h3>
                      <p className="text-sm text-[#807c73] line-clamp-2">
                        {related.shortDescription}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-[#1d1e1f] border border-[#2a2520] rounded-2xl p-6">
              <a
                href={skill.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-[#ffbc20] to-[#ffd980] hover:from-[#ffd980] hover:to-[#ffecbf] rounded-lg font-medium text-[#1a160d] transition-all glow-hover mb-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                View on GitHub
              </a>
              <a
                href={`${skill.repoUrl}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#2a2520] hover:bg-[#3a3530] rounded-lg font-medium transition-colors"
              >
                Report Issue
              </a>
            </div>

            {/* Stats */}
            <div className="bg-[#1d1e1f] border border-[#2a2520] rounded-2xl p-6">
              <h3 className="text-sm text-[#807c73] uppercase tracking-wider mb-4">Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#bfbfbf]">Downloads</span>
                  <span className="font-medium">{skill.downloads.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#bfbfbf]">Stars</span>
                  <span className="flex items-center gap-1 font-medium">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {skill.stars}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#bfbfbf]">Version</span>
                  <span className="font-mono text-sm bg-[#2a2520] px-2 py-0.5 rounded">
                    v{skill.version}
                  </span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-[#1d1e1f] border border-[#2a2520] rounded-2xl p-6">
              <h3 className="text-sm text-[#807c73] uppercase tracking-wider mb-4">Info</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#bfbfbf]">Category</span>
                  <Link
                    href={`/skills?category=${skill.category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-[#ffbc20] hover:text-[#ffd980] transition-colors"
                  >
                    {skill.category}
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#bfbfbf]">Created</span>
                  <span className="text-[#f5f0e6]">
                    {new Date(skill.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#bfbfbf]">Updated</span>
                  <span className="text-[#f5f0e6]">
                    {new Date(skill.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Author */}
            <div className="bg-[#1d1e1f] border border-[#2a2520] rounded-2xl p-6">
              <h3 className="text-sm text-[#807c73] uppercase tracking-wider mb-4">Author</h3>
              <a
                href={skill.authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#ffbc20] to-[#ffd980] rounded-full flex items-center justify-center text-[#1a160d] font-medium">
                  {skill.author[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-medium group-hover:text-[#ffbc20] transition-colors">
                    {skill.author}
                  </div>
                  <div className="text-sm text-[#807c73]">View profile</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

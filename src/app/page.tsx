import Link from 'next/link';
import SkillCard from '@/components/SkillCard';
import skillsData from '@/data/skills.json';
import { Skill } from '@/types';

export default function Home() {
  const featuredSkills = (skillsData.skills as Skill[]).filter((s) => s.featured);
  const recentSkills = [...(skillsData.skills as Skill[])]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#ffbc20]/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffbc20]/10 border border-[#ffbc20]/20 rounded-full mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffd980] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffbc20]"></span>
              </span>
              <span className="text-sm text-[#ffd980]">Open source skill marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Supercharge your{' '}
              <span className="gradient-text">AI agents</span>
              <br />
              with community skills
            </h1>

            <p className="text-lg sm:text-xl text-[#bfbfbf] max-w-2xl mx-auto mb-10">
              Discover, share, and install skills for Claude Code, Cursor, Codex, and more.
              Extend your AI assistant with powerful integrations built by the community.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/skills"
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#ffbc20] to-[#ffd980] hover:from-[#ffd980] hover:to-[#ffecbf] rounded-lg font-medium text-[#1a160d] transition-all glow-hover"
              >
                Browse Skills
              </Link>
              <Link
                href="/submit"
                className="w-full sm:w-auto px-8 py-3 bg-[#1d1e1f] border border-[#2a2520] hover:border-[#ffbc20]/50 rounded-lg font-medium transition-colors"
              >
                Submit Your Skill
              </Link>
            </div>

            {/* Quick Install Example */}
            <div className="mt-12 p-4 bg-[#1d1e1f] border border-[#2a2520] rounded-xl max-w-lg mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#807c73]">Install a skill</span>
                <button className="text-xs text-[#ffbc20] hover:text-[#ffd980] transition-colors">
                  Copy
                </button>
              </div>
              <code className="text-sm text-[#ffd980] font-mono">
                npx skills add skillshq/github-skill
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Agents */}
      <section className="py-16 border-y border-[#2a2520]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[#807c73] text-sm mb-8">
            SKILLS FOR YOUR FAVORITE AI AGENTS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {skillsData.agents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center gap-2 text-[#bfbfbf] hover:text-[#f5f0e6] transition-colors"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: agent.color }}
                />
                <span className="font-medium">{agent.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What are Skills */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                What are <span className="text-[#ffbc20]">Skills</span>?
              </h2>
              <p className="text-[#bfbfbf] text-lg mb-6">
                Skills are modular capabilities that extend what your AI agent can do.
                Think of them as plugins that give your assistant new superpowers.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#ffbc20]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-[#ffbc20]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Connect to services</h4>
                    <p className="text-sm text-[#bfbfbf]">GitHub, Slack, Notion, databases, and more</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#ffbc20]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-[#ffbc20]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Automate workflows</h4>
                    <p className="text-sm text-[#bfbfbf]">Schedule tasks, send notifications, manage projects</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#ffbc20]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-[#ffbc20]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Cross-agent compatible</h4>
                    <p className="text-sm text-[#bfbfbf]">Skills work across multiple AI platforms</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ffbc20]/20 to-[#ffd980]/20 rounded-2xl blur-2xl" />
              <div className="relative bg-[#1d1e1f] border border-[#2a2520] rounded-2xl p-6 font-mono text-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="space-y-2">
                  <p><span className="text-[#ffbc20]">$</span> npx skills add weatherapi/weather-skill</p>
                  <p className="text-[#807c73]">Installing weather-skill v1.4.2...</p>
                  <p className="text-green-400">Skill installed successfully</p>
                  <p className="mt-4"><span className="text-[#ffbc20]">$</span> claude</p>
                  <p className="text-[#ffd980]">&gt; What&apos;s the weather in Pittsburgh?</p>
                  <p className="text-[#bfbfbf] mt-2">Currently 45°F and cloudy in Pittsburgh, PA. High of 52°F expected today with a 30% chance of rain this evening.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="py-20 bg-[#141313]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Skills</h2>
              <p className="text-[#bfbfbf]">Hand-picked skills loved by the community</p>
            </div>
            <Link
              href="/skills"
              className="hidden sm:flex items-center gap-2 text-[#ffbc20] hover:text-[#ffd980] transition-colors"
            >
              View all skills
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} featured />
            ))}
          </div>
        </div>
      </section>

      {/* Recently Updated */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Recently Updated</h2>
              <p className="text-[#bfbfbf]">The latest skill updates from the community</p>
            </div>
            <Link
              href="/skills"
              className="hidden sm:flex items-center gap-2 text-[#ffbc20] hover:text-[#ffd980] transition-colors"
            >
              View all skills
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-[#2a2520]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to share your skill?
          </h2>
          <p className="text-lg text-[#bfbfbf] mb-8 max-w-2xl mx-auto">
            Join our growing community of developers building the future of AI tooling.
            Submit your skill and help others extend their AI agents.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/submit"
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#ffbc20] to-[#ffd980] hover:from-[#ffd980] hover:to-[#ffecbf] rounded-lg font-medium text-[#1a160d] transition-all glow-hover"
            >
              Submit Your Skill
            </Link>
            <a
              href="https://github.com/ai-at-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3 bg-[#1d1e1f] border border-[#2a2520] hover:border-[#ffbc20]/50 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              Star on GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

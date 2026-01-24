import Link from 'next/link';
import { Skill } from '@/types';
import AgentBadge from './AgentBadge';

interface SkillCardProps {
  skill: Skill;
  featured?: boolean;
}

export default function SkillCard({ skill, featured = false }: SkillCardProps) {
  return (
    <Link href={`/skills/${skill.slug}`}>
      <div
        className={`group relative bg-[#1d1e1f] border border-[#2a2520] rounded-xl p-6 transition-all duration-300 hover:border-[#ffbc20]/50 hover:bg-[#252320] ${
          featured ? 'glow-hover' : ''
        }`}
      >
        {featured && (
          <div className="absolute -top-3 left-4">
            <span className="px-3 py-1 bg-gradient-to-r from-[#ffbc20] to-[#ffd980] rounded-full text-xs font-medium text-[#1a160d]">
              Featured
            </span>
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1 group-hover:text-[#ffbc20] transition-colors">
              {skill.name}
            </h3>
            <p className="text-sm text-[#bfbfbf]">by {skill.author}</p>
          </div>
          <div className="flex items-center gap-1 text-[#bfbfbf]">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-sm">{skill.stars}</span>
          </div>
        </div>

        <p className="text-[#bfbfbf] text-sm mb-4 line-clamp-2">
          {skill.shortDescription}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {skill.agents.slice(0, 3).map((agentId) => (
            <AgentBadge key={agentId} agentId={agentId} size="sm" />
          ))}
          {skill.agents.length > 3 && (
            <span className="px-2 py-0.5 bg-[#2a2520] text-[#bfbfbf] rounded text-xs">
              +{skill.agents.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-[#807c73]">
          <span className="px-2 py-1 bg-[#2a2520] rounded">{skill.category}</span>
          <span>v{skill.version}</span>
        </div>
      </div>
    </Link>
  );
}

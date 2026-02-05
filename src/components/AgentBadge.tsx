import skillsData from '@/data/skills.json';

interface AgentBadgeProps {
  agentId: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

const agentColors: Record<string, string> = {
  'claude-code': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'cursor': 'bg-[#ffbc20]/20 text-[#ffbc20] border-[#ffbc20]/30',
  'codex': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'openclaw': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'antigravity': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'gemini': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

const agentIcons: Record<string, React.ReactNode> = {
  'claude-code': (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  'cursor': (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  'codex': (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
  'openclaw': (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  'antigravity': (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  'gemini': (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
};

export default function AgentBadge({ agentId, size = 'sm', showName = true }: AgentBadgeProps) {
  const agent = skillsData.agents.find((a) => a.id === agentId);
  if (!agent) return null;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  };

  const colorClass = agentColors[agentId] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';

  return (
    <span
      className={`inline-flex items-center rounded border ${colorClass} ${sizeClasses[size]}`}
    >
      {agentIcons[agentId]}
      {showName && <span>{agent.name}</span>}
    </span>
  );
}

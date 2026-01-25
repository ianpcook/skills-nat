import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Skill {
  name: string;
  author: string;
  description: string;
  stars: number;
  agents: string[];
  category: string;
  version: string;
  featured?: boolean;
}

const agentColors: Record<string, string> = {
  "Claude Code": "#0D0D0D",
  Cursor: "#D4940F",
  Codex: "#0D0D0D",
  Clawdbot: "#D4940F",
  Antigravity: "#0D0D0D",
  Gemini: "#D4940F",
};

export function SkillCard({ skill }: { skill: Skill }) {
  const displayedAgents = skill.agents.slice(0, 2);
  const remainingAgents = skill.agents.length - 2;

  return (
    <div className="flex h-full flex-col border border-foreground/20 bg-card p-5 transition-all hover:border-foreground/40">
      <div className="mb-3 flex items-start justify-between">
        <div>
          {skill.featured && (
            <Badge className="mb-2 border border-foreground bg-transparent text-foreground">
              Featured
            </Badge>
          )}
          <h3 className="font-semibold text-card-foreground">{skill.name}</h3>
          <p className="text-xs text-card-foreground/60">by {skill.author}</p>
        </div>
        <div className="flex items-center gap-1 text-card-foreground/70">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span className="text-sm">{skill.stars}</span>
        </div>
      </div>
      <p className="mb-4 flex-1 text-sm text-card-foreground/70">
        {skill.description}
      </p>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {displayedAgents.map((agent) => (
          <Badge
            key={agent}
            variant="outline"
            className="border-foreground/20 bg-background text-xs text-foreground"
            style={{ borderLeftColor: agentColors[agent], borderLeftWidth: 3 }}
          >
            {agent}
          </Badge>
        ))}
        {remainingAgents > 0 && (
          <Badge
            variant="outline"
            className="border-foreground/20 bg-background text-xs text-foreground"
          >
            +{remainingAgents}
          </Badge>
        )}
      </div>
      <div className="flex items-center justify-between border-t border-foreground/10 pt-3 text-xs text-card-foreground/50">
        <span>{skill.category}</span>
        <span>{skill.version}</span>
      </div>
    </div>
  );
}

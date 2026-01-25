import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getAgentName, getAgentColor } from "@/lib/constants";
import { type Skill as BackendSkill } from "@/db/schema";

// Frontend skill interface that works with both backend data and hardcoded data
export interface Skill {
  id?: string;
  slug?: string;
  name: string;
  author: string | null;
  description: string | null;
  shortDescription?: string | null;
  stars: number;
  agents: string[];
  category: string | null;
  version: string;
  featured?: boolean;
}

// Convert backend skill to frontend skill format
export function toDisplaySkill(skill: BackendSkill): Skill {
  return {
    id: skill.id,
    slug: skill.slug,
    name: skill.name,
    author: skill.author,
    description: skill.shortDescription || skill.description,
    shortDescription: skill.shortDescription,
    stars: skill.stars,
    agents: skill.agents,
    category: skill.category,
    version: skill.version,
    featured: false, // Backend doesn't have featured flag yet
  };
}

interface SkillCardProps {
  skill: Skill;
  featured?: boolean;
}

export function SkillCard({ skill, featured }: SkillCardProps) {
  // Transform agent IDs to display names
  const agentDisplayInfo = skill.agents.map(agentId => ({
    id: agentId,
    name: getAgentName(agentId),
    color: getAgentColor(agentId),
  }));
  
  const displayedAgents = agentDisplayInfo.slice(0, 2);
  const remainingAgents = agentDisplayInfo.length - 2;

  const isFeatured = featured || skill.featured;

  return (
    <div className="flex h-full flex-col border border-foreground/20 bg-card p-5 transition-all hover:border-foreground/40">
      <div className="mb-3 flex items-start justify-between">
        <div>
          {isFeatured && (
            <Badge className="mb-2 border border-foreground bg-transparent text-foreground">
              Featured
            </Badge>
          )}
          <h3 className="font-semibold text-card-foreground">{skill.name}</h3>
          <p className="text-xs text-card-foreground/60">
            by {skill.author || "unknown"}
          </p>
        </div>
        <div className="flex items-center gap-1 text-card-foreground/70">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span className="text-sm">{skill.stars}</span>
        </div>
      </div>
      <p className="mb-4 flex-1 text-sm text-card-foreground/70">
        {skill.description || "No description available"}
      </p>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {displayedAgents.map((agent) => (
          <Badge
            key={agent.id}
            variant="outline"
            className="border-foreground/20 bg-background text-xs text-foreground"
            style={{ borderLeftColor: agent.color, borderLeftWidth: 3 }}
          >
            {agent.name}
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
        <span>{skill.category || "Uncategorized"}</span>
        <span>{skill.version}</span>
      </div>
    </div>
  );
}

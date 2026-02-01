"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Check, ExternalLink, Star } from "lucide-react"
import { useState } from "react"

// Backend skill type (from API)
export interface BackendSkill {
  id: string;
  slug: string;
  name: string;
  author: string | null;
  description: string | null;
  shortDescription?: string | null;
  stars: number;
  agents: string[];
  category: string | null;
  version: string | null;
}

// Display skill type (for UI)
export interface Skill {
  id: string;
  slug?: string;
  name: string;
  author: string;
  authorLocation?: string;
  description: string;
  shortDescription?: string | null;
  installCommand?: string;
  tags?: string[];
  agents: string[];
  category?: string;
  version?: string;
  stars: number;
  accentColor?: string;
  icon?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  featured?: boolean;
}

// Transform backend skill to display skill
export const toDisplaySkill = (skill: BackendSkill): Skill => ({
  id: skill.id,
  slug: skill.slug,
  name: skill.name,
  author: skill.author || 'Anonymous',
  description: skill.shortDescription || skill.description || '',
  shortDescription: skill.shortDescription,
  stars: skill.stars,
  agents: skill.agents || [],
  category: skill.category || undefined,
  version: skill.version || undefined,
  featured: false,
  // Generate install command from slug
  installCommand: `npx skillsnat add @pgh/${skill.slug}`,
  // Default color based on category or hash
  accentColor: getCategoryColor(skill.category || undefined),
  // Default icon based on category
  icon: getCategoryIcon(skill.category || undefined),
});

// Helper to get accent color from category
function getCategoryColor(category?: string): string {
  const colorMap: Record<string, string> = {
    'Data': 'cyan',
    'API': 'yellow',
    'Productivity': 'pink',
    'Entertainment': 'orange',
    'Local': 'lime',
  };
  return colorMap[category || ''] || 'yellow';
}

// Helper to get icon from category
function getCategoryIcon(category?: string): string {
  const iconMap: Record<string, string> = {
    'Data': '📊',
    'API': '🔌',
    'Productivity': '⚡',
    'Entertainment': '🎮',
    'Local': '📍',
    'Transit': '🚌',
    'Food': '🥟',
    'Research': '📚',
    'Weather': '⛈️',
    'Sports': '🏈',
  };
  return iconMap[category || ''] || '🔧';
}

interface SkillCardProps {
  skill: Skill;
  variant?: "default" | "featured";
  featured?: boolean;
}

const colorClasses: Record<string, { bg: string; bgSolid: string }> = {
  yellow: { bg: "bg-pop-yellow", bgSolid: "bg-pop-yellow" },
  pink: { bg: "bg-pop-pink", bgSolid: "bg-pop-pink" },
  cyan: { bg: "bg-pop-cyan", bgSolid: "bg-pop-cyan" },
  orange: { bg: "bg-pop-orange", bgSolid: "bg-pop-orange" },
  lime: { bg: "bg-pop-lime", bgSolid: "bg-pop-lime" },
}

export function SkillCard({ skill, variant = "default", featured }: SkillCardProps) {
  const [copied, setCopied] = useState(false)
  const colors = colorClasses[skill.accentColor || 'yellow'] || colorClasses.yellow
  const installCommand = skill.installCommand || `npx skillsnat add @pgh/${skill.slug || skill.name.toLowerCase().replace(/\s+/g, '-')}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Derive tags from category if not provided
  const tags = skill.tags || (skill.category ? [skill.category] : [])

  return (
    <div 
      className={`
        group relative border-4 border-foreground ${colors.bg}
        p-0 transition-all duration-200 
        shadow-[6px_6px_0_0_theme(colors.foreground)]
        hover:shadow-[2px_2px_0_0_theme(colors.foreground)] 
        hover:translate-x-1 hover:translate-y-1
        ${variant === "featured" || featured ? "md:col-span-2" : ""}
        overflow-hidden
      `}
    >
      {/* Corner badges - Warhol style */}
      <div className="absolute top-0 right-0 flex">
        {skill.isNew && (
          <div className="bg-pop-pink text-foreground font-black text-xs px-3 py-1 border-l-4 border-b-4 border-foreground uppercase">
            NEW!
          </div>
        )}
        {(skill.isFeatured || skill.featured || featured) && (
          <div className="bg-pop-yellow text-foreground font-black text-xs px-3 py-1 border-l-4 border-b-4 border-foreground uppercase flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            HOT
          </div>
        )}
      </div>

      {/* Header stripe with icon */}
      <div className="bg-foreground text-card p-4 flex items-center gap-4">
        <div className={`text-3xl ${colors.bgSolid} p-2 border-2 border-card`}>
          {skill.icon || '🔧'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black uppercase truncate">{skill.name}</h3>
          <p className="text-xs opacity-80">
            by {skill.author}{skill.authorLocation ? ` • ${skill.authorLocation}` : ''}
          </p>
        </div>
      </div>

      {/* Content area */}
      <div className="p-4 bg-card">
        {/* Description */}
        <p className="text-foreground text-sm mb-4 line-clamp-2">
          {skill.shortDescription || skill.description}
        </p>

        {/* Tags - pop art style */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag, i) => (
              <Badge 
                key={tag} 
                className={`
                  ${i === 0 ? 'bg-pop-pink' : i === 1 ? 'bg-pop-cyan' : 'bg-pop-lime'}
                  text-foreground font-bold text-xs border-2 border-foreground uppercase
                `}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Compatible Agents */}
        {skill.agents && skill.agents.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            <span className="text-xs font-bold text-muted-foreground mr-1 uppercase">Works with:</span>
            {skill.agents.slice(0, 3).map((agent) => (
              <span key={agent} className="text-xs font-medium text-foreground bg-muted px-2 py-0.5 border border-foreground">
                {agent}
              </span>
            ))}
            {skill.agents.length > 3 && (
              <span className="text-xs font-bold text-muted-foreground">+{skill.agents.length - 3}</span>
            )}
          </div>
        )}

        {/* Install Command - terminal style */}
        <div className="bg-foreground text-card p-3 mb-4 border-2 border-foreground">
          <div className="flex items-center justify-between gap-2">
            <code className="text-xs font-mono truncate flex-1">
              <span className="text-pop-yellow">$</span> {installCommand}
            </code>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-7 w-7 shrink-0 text-card hover:text-pop-yellow hover:bg-transparent"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-foreground font-bold">
            <Star className="h-4 w-4 fill-pop-yellow text-pop-yellow" />
            <span className="text-sm">{skill.stars}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-foreground font-bold hover:bg-pop-yellow border-2 border-foreground uppercase text-xs"
          >
            Details
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

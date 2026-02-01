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

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await navigator.clipboard.writeText(installCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Single category for display
  const category = skill.category || (skill.tags && skill.tags[0])

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
      <div className="absolute top-0 right-0 flex z-10">
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
      <div className="bg-foreground text-card p-4 flex items-center gap-3">
        <div className={`text-2xl ${colors.bgSolid} p-2 border-2 border-card`}>
          {skill.icon || '🔧'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-black uppercase truncate">{skill.name}</h3>
          <p className="text-xs opacity-70">by {skill.author}</p>
        </div>
        {/* Stars inline in header */}
        <div className="flex items-center gap-1 text-card font-bold shrink-0">
          <Star className="h-4 w-4 fill-pop-yellow text-pop-yellow" />
          <span className="text-sm">{skill.stars}</span>
        </div>
      </div>

      {/* Content area - simplified */}
      <div className="p-4 bg-card">
        {/* Description */}
        <p className="text-foreground text-sm mb-3 line-clamp-2">
          {skill.shortDescription || skill.description}
        </p>

        {/* Category + Agents in one line */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {category && (
            <Badge className="bg-pop-pink text-foreground font-bold text-xs border-2 border-foreground uppercase">
              {category}
            </Badge>
          )}
          {skill.agents && skill.agents.length > 0 && (
            <span className="text-xs font-bold text-muted-foreground">
              {skill.agents.length} agent{skill.agents.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* PRIMARY ACTION: Install Command - made prominent */}
        <button
          onClick={handleCopy}
          className="w-full bg-foreground text-card p-3 border-2 border-foreground group/copy hover:bg-foreground/90 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between gap-2">
            <code className="text-xs font-mono truncate flex-1 text-left">
              <span className="text-pop-yellow">$</span> {installCommand}
            </code>
            <div className={`shrink-0 flex items-center gap-1 font-bold text-xs uppercase ${copied ? 'text-pop-lime' : 'text-pop-yellow'}`}>
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

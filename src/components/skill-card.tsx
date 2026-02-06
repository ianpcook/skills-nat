"use client"

import { Badge } from "@/components/ui/badge"
import { Copy, Check, Star, Download, BookOpen } from "lucide-react"
import { useState } from "react"

import { ACCENT_COLOR_CLASSES, type Skill } from "@/lib/skill-utils"

interface SkillCardProps {
  skill: Skill;
  variant?: "default" | "featured";
  featured?: boolean;
}

export function SkillCard({ skill, variant = "default", featured }: SkillCardProps) {
  const [copied, setCopied] = useState(false)
  const colors = ACCENT_COLOR_CLASSES[skill.accentColor || 'yellow'] || ACCENT_COLOR_CLASSES.yellow
  const installCommand = skill.installCommand || `npx skills add https://github.com/ianpcook/skills-nat --skill ${skill.slug || skill.name.toLowerCase().replace(/\s+/g, '-')}`

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
        {/* Stars inline in header - hidden when 0 */}
        {skill.stars > 0 && (
          <div className="flex items-center gap-1 text-card font-bold shrink-0">
            <Star className="h-4 w-4 fill-pop-yellow text-pop-yellow" />
            <span className="text-sm">{skill.stars}</span>
          </div>
        )}
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

        {/* Secondary actions: Download ZIP + Install Guide */}
        <div className="flex gap-2 mt-2">
          <a
            href={`/api/skills/${skill.slug}/download`}
            download={`${skill.slug}.zip`}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-2 bg-card text-foreground p-2 border-2 border-foreground font-bold text-xs uppercase hover:bg-pop-cyan transition-colors"
          >
            <Download className="h-4 w-4" />
            Download ZIP
          </a>
          <a
            href="/docs#installing"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-2 bg-card text-foreground p-2 border-2 border-foreground font-bold text-xs uppercase hover:bg-pop-pink transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            Install Guide
          </a>
        </div>
      </div>
    </div>
  )
}

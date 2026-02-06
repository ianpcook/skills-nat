"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Copy, Check, Star, Loader2, Download, BookOpen } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { toDisplaySkill, ACCENT_COLOR_CLASSES, type Skill } from "@/lib/skill-utils"

export function HeroSection() {
  const [skillCopied, setSkillCopied] = useState(false)
  const [featuredSkill, setFeaturedSkill] = useState<Skill | null>(null)
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true)

  useEffect(() => {
    const fetchRandomSkill = async () => {
      try {
        const res = await fetch('/api/skills?limit=50')
        if (res.ok) {
          const data = await res.json()
          if (data.skills && data.skills.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.skills.length)
            const skill = toDisplaySkill(data.skills[randomIndex])
            setFeaturedSkill(skill)
          }
        }
      } catch {
        // Silently degrade — featured card is non-critical
      } finally {
        setIsLoadingFeatured(false)
      }
    }
    fetchRandomSkill()
  }, [])

  const handleSkillCopy = async () => {
    if (!featuredSkill?.installCommand) return
    await navigator.clipboard.writeText(featuredSkill.installCommand)
    setSkillCopied(true)
    setTimeout(() => setSkillCopied(false), 2000)
  }

  const colors = ACCENT_COLOR_CLASSES[featuredSkill?.accentColor || 'yellow'] || ACCENT_COLOR_CLASSES.yellow

  return (
    <section className="relative pt-12 pb-6 md:pt-20 md:pb-8 overflow-hidden">
      {/* Warhol-style color block background */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 pointer-events-none opacity-[0.08]">
        <div className="bg-pop-pink" />
        <div className="bg-pop-cyan" />
        <div className="bg-pop-lime" />
        <div className="bg-pop-orange" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
          {/* Left column - Hero text + CTAs */}
          <div className="text-center lg:text-left">
            {/* Badge with pop-art styling */}
            <div className="inline-flex items-center gap-2 px-6 py-3 border-3 border-foreground bg-pop-pink text-foreground text-base md:text-lg font-bold mb-6 shadow-[4px_4px_0_0_theme(colors.foreground)]">
              <Sparkles className="h-5 w-5" />
              <span>Made in Pittsburgh, for the world</span>
            </div>

            {/* Main headline */}
            <h1 className="font-black tracking-tight uppercase">
              <span className="block text-4xl md:text-5xl lg:text-6xl text-foreground mb-2">
                Skills for your Agents
              </span>
              <span
                className="block text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-pop-yellow"
                style={{
                  WebkitTextStroke: '3px currentColor',
                  textShadow: '4px 4px 0 var(--pop-pink), 8px 8px 0 var(--pop-cyan)'
                }}
              >
                N{"'"}at
              </span>
            </h1>

            {/* CTA Buttons - in left column */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mt-8">
              <Link href="/skills">
                <Button
                  size="lg"
                  className="bg-pop-yellow text-foreground hover:bg-pop-orange font-black text-lg px-8 py-6 border-3 border-foreground shadow-[6px_6px_0_0_theme(colors.foreground)] hover:shadow-[2px_2px_0_0_theme(colors.foreground)] hover:translate-x-1 hover:translate-y-1 transition-all uppercase tracking-wide"
                >
                  Browse All Skills
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/submit">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-3 border-foreground text-foreground hover:bg-pop-cyan hover:text-foreground font-black text-lg px-8 py-6 shadow-[6px_6px_0_0_theme(colors.pop-pink)] hover:shadow-[2px_2px_0_0_theme(colors.pop-pink)] hover:translate-x-1 hover:translate-y-1 transition-all bg-card uppercase tracking-wide"
                >
                  Submit Your Skill
                </Button>
              </Link>
            </div>
          </div>

          {/* Right column - Featured Skill Card */}
          <div className="flex justify-center lg:justify-end">
            {isLoadingFeatured ? (
              <div className="w-full max-w-md border-4 border-foreground bg-card p-8 flex items-center justify-center shadow-[6px_6px_0_0_theme(colors.foreground)]">
                <Loader2 className="h-8 w-8 animate-spin text-pop-pink" />
              </div>
            ) : featuredSkill ? (
              <Link href={`/skills/${featuredSkill.slug}`} className="block w-full max-w-md">
                <div
                  className={`
                    group relative border-4 border-foreground ${colors.bg}
                    p-0 transition-all duration-200
                    shadow-[6px_6px_0_0_theme(colors.foreground)]
                    hover:shadow-[2px_2px_0_0_theme(colors.foreground)]
                    hover:translate-x-1 hover:translate-y-1
                    overflow-hidden w-full
                  `}
                >
                  {/* Corner badge */}
                  <div className="absolute top-0 right-0 flex z-10">
                    <div className="bg-pop-yellow text-foreground font-black text-xs px-3 py-1 border-l-4 border-b-4 border-foreground uppercase flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      FEATURED
                    </div>
                  </div>

                  {/* Header stripe with icon */}
                  <div className="bg-foreground text-card p-4 flex items-center gap-3">
                    <div className={`text-2xl ${colors.bgSolid} p-2 border-2 border-card`}>
                      {featuredSkill.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-black uppercase truncate">{featuredSkill.name}</h3>
                      <p className="text-xs opacity-70">by {featuredSkill.author}</p>
                    </div>
                    {featuredSkill.stars > 0 && (
                      <div className="flex items-center gap-1 text-card font-bold shrink-0">
                        <Star className="h-4 w-4 fill-pop-yellow text-pop-yellow" />
                        <span className="text-sm">{featuredSkill.stars}</span>
                      </div>
                    )}
                  </div>

                  {/* Content area */}
                  <div className="p-4 bg-card">
                    {/* Description - hidden on mobile */}
                    <p className="hidden md:block text-foreground text-sm mb-3 line-clamp-2">
                      {featuredSkill.description}
                    </p>

                    {/* Category + Agents - hidden on mobile */}
                    <div className="hidden md:flex items-center gap-2 mb-4">
                      {featuredSkill.category && (
                        <span className="bg-pop-pink text-foreground font-bold text-xs border-2 border-foreground uppercase px-2 py-0.5">
                          {featuredSkill.category}
                        </span>
                      )}
                      <span className="text-xs font-bold text-muted-foreground">
                        {featuredSkill.agents.length} agent{featuredSkill.agents.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Install Command */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleSkillCopy()
                      }}
                      className="w-full bg-foreground text-card p-3 border-2 border-foreground hover:bg-foreground/90 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <code className="text-xs font-mono truncate flex-1 text-left">
                          <span className="text-pop-yellow">$</span> {featuredSkill.installCommand}
                        </code>
                        <div className={`shrink-0 flex items-center gap-1 font-bold text-xs uppercase ${skillCopied ? 'text-pop-lime' : 'text-pop-yellow'}`}>
                          {skillCopied ? (
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
                        href={`/api/skills/${featuredSkill.slug}/download`}
                        download={`${featuredSkill.slug}.zip`}
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
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Copy, Check, Terminal, Star, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

const featuredSkills = [
  {
    id: "1",
    name: "Pittsburgh Transit API",
    description: "Get real-time bus and rail data from Port Authority. Track schedules, delays, and plan routes across the Steel City.",
    author: "yinzer_dev",
    authorLocation: "Squirrel Hill",
    installCommand: "npx skillsnat add @pgh/transit-skill",
    tags: ["transit", "api", "real-time"],
    agents: ["Claude Code", "Codex", "Cursor", "OpenClaw", "Antigravity"],
    stars: 127,
    accentColor: "yellow",
    icon: "🚌",
  },
  {
    id: "2",
    name: "Pierogi Finder",
    description: "Locate the best pierogis in Pittsburgh. Search by filling, neighborhood, and open hours. Mrs. T would be proud.",
    author: "iron_city_io",
    authorLocation: "Polish Hill",
    installCommand: "npx skillsnat add @pgh/pierogi-skill",
    tags: ["food", "local", "search"],
    agents: ["Claude Code", "Cursor", "Aider"],
    stars: 89,
    accentColor: "pink",
    icon: "🥟",
  },
  {
    id: "3",
    name: "CMU Research Papers",
    description: "Search and summarize research papers from Carnegie Mellon University. AI, robotics, and computer science focus.",
    author: "tartan_coder",
    authorLocation: "Oakland",
    installCommand: "npx skillsnat add @pgh/cmu-papers",
    tags: ["research", "academic", "ai"],
    agents: ["Claude Code", "Codex", "Cursor", "OpenClaw", "Antigravity", "Continue"],
    stars: 256,
    accentColor: "cyan",
    icon: "📚",
  },
  {
    id: "4",
    name: "Three Rivers Weather",
    description: "Hyperlocal weather data for Pittsburgh neighborhoods. Know if it's raining downtown when it's sunny in Shadyside.",
    author: "bridge_builder",
    authorLocation: "North Shore",
    installCommand: "npx skillsnat add @pgh/weather-skill",
    tags: ["weather", "local", "api"],
    agents: ["Claude Code", "Codex", "Cursor"],
    stars: 73,
    accentColor: "lime",
    icon: "⛈️",
  },
  {
    id: "5",
    name: "Steelers Stats",
    description: "Real-time and historical Pittsburgh Steelers statistics. Player data, game scores, and Terrible Towel moments.",
    author: "steel_curtain",
    authorLocation: "South Side",
    installCommand: "npx skillsnat add @pgh/steelers-stats",
    tags: ["sports", "nfl", "stats"],
    agents: ["Claude Code", "Cursor", "Windsurf"],
    stars: 184,
    accentColor: "orange",
    icon: "🏈",
  },
  {
    id: "6",
    name: "Pitt Event Scraper",
    description: "Scrape and organize events from University of Pittsburgh. Concerts, lectures, and campus happenings.",
    author: "panther_dev",
    authorLocation: "Oakland",
    installCommand: "npx skillsnat add @pgh/pitt-events",
    tags: ["events", "scraping", "university"],
    agents: ["Claude Code", "Codex", "Antigravity"],
    stars: 62,
    accentColor: "yellow",
    icon: "🎓",
  },
]

const colorClasses: Record<string, { bg: string; bgSolid: string }> = {
  yellow: { bg: "bg-pop-yellow", bgSolid: "bg-pop-yellow" },
  pink: { bg: "bg-pop-pink", bgSolid: "bg-pop-pink" },
  cyan: { bg: "bg-pop-cyan", bgSolid: "bg-pop-cyan" },
  orange: { bg: "bg-pop-orange", bgSolid: "bg-pop-orange" },
  lime: { bg: "bg-pop-lime", bgSolid: "bg-pop-lime" },
}

export function HeroSection() {
  const [copied, setCopied] = useState(false)
  const [skillCopied, setSkillCopied] = useState(false)
  const [randomSkill, setRandomSkill] = useState(featuredSkills[0])

  useEffect(() => {
    // Pick a random skill on mount (client-side only)
    const randomIndex = Math.floor(Math.random() * featuredSkills.length)
    setRandomSkill(featuredSkills[randomIndex])
  }, [])

  const handleSkillCopy = async () => {
    await navigator.clipboard.writeText(randomSkill.installCommand)
    setSkillCopied(true)
    setTimeout(() => setSkillCopied(false), 2000)
  }

  const colors = colorClasses[randomSkill.accentColor] || colorClasses.yellow

  return (
    <section className="relative pt-12 pb-6 md:pt-20 md:pb-8 overflow-hidden">
      {/* Warhol-style color block background - inspired by the cat/dog quadrants */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 pointer-events-none opacity-[0.08]">
        <div className="bg-pop-pink" />
        <div className="bg-pop-cyan" />
        <div className="bg-pop-lime" />
        <div className="bg-pop-orange" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
          {/* Left column - Hero text */}
          <div className="text-center lg:text-left">
            {/* Badge with pop-art styling */}
            <div className="inline-flex items-center gap-2 px-6 py-3 border-3 border-foreground bg-pop-pink text-foreground text-base md:text-lg font-bold mb-6 shadow-[4px_4px_0_0_theme(colors.foreground)]">
              <Sparkles className="h-5 w-5" />
              <span>Made in Pittsburgh, for the world</span>
            </div>

            {/* Main headline - bold like the poster text */}
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
          </div>

          {/* Right column - Featured Skill Card */}
          <div className="flex justify-center lg:justify-end">
            <div 
              className={`
                group relative border-4 border-foreground ${colors.bg}
                p-0 transition-all duration-200 
                shadow-[6px_6px_0_0_theme(colors.foreground)]
                hover:shadow-[2px_2px_0_0_theme(colors.foreground)] 
                hover:translate-x-1 hover:translate-y-1
                overflow-hidden w-full max-w-md
              `}
            >
              {/* Corner badge */}
              <div className="absolute top-0 right-0 flex">
                <div className="bg-pop-yellow text-foreground font-black text-xs px-3 py-1 border-l-4 border-b-4 border-foreground uppercase flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  FEATURED
                </div>
              </div>

              {/* Header stripe with icon */}
              <div className="bg-foreground text-card p-4 flex items-center gap-4">
                <div className={`text-3xl ${colors.bgSolid} p-2 border-2 border-card`}>
                  {randomSkill.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black uppercase truncate">{randomSkill.name}</h3>
                  <p className="text-xs opacity-80">
                    by {randomSkill.author} • {randomSkill.authorLocation}
                  </p>
                </div>
              </div>

              {/* Content area */}
              <div className="p-4 bg-card">
                {/* Description */}
                <p className="text-foreground text-sm mb-4 line-clamp-2">
                  {randomSkill.description}
                </p>

                {/* Tags - pop art style */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {randomSkill.tags.slice(0, 3).map((tag, i) => (
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

                {/* Compatible Agents */}
                <div className="flex flex-wrap gap-1 mb-4">
                  <span className="text-xs font-bold text-muted-foreground mr-1 uppercase">Works with:</span>
                  {randomSkill.agents.slice(0, 3).map((agent) => (
                    <span key={agent} className="text-xs font-medium text-foreground bg-muted px-2 py-0.5 border border-foreground">
                      {agent}
                    </span>
                  ))}
                  {randomSkill.agents.length > 3 && (
                    <span className="text-xs font-bold text-muted-foreground">+{randomSkill.agents.length - 3}</span>
                  )}
                </div>

                {/* Install Command - terminal style */}
                <div className="bg-foreground text-card p-3 mb-4 border-2 border-foreground">
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-xs font-mono truncate flex-1">
                      <span className="text-pop-yellow">$</span> {randomSkill.installCommand}
                    </code>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-7 w-7 shrink-0 text-card hover:text-pop-yellow hover:bg-transparent"
                      onClick={handleSkillCopy}
                    >
                      {skillCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-foreground font-bold">
                    <Star className="h-4 w-4 fill-pop-yellow text-pop-yellow" />
                    <span className="text-sm">{randomSkill.stars}</span>
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
          </div>
        </div>

        {/* CTA Buttons - centered below both columns */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
          <Button 
            size="lg" 
            className="bg-pop-yellow text-foreground hover:bg-pop-orange font-black text-lg px-8 py-6 border-3 border-foreground shadow-[6px_6px_0_0_theme(colors.foreground)] hover:shadow-[2px_2px_0_0_theme(colors.foreground)] hover:translate-x-1 hover:translate-y-1 transition-all uppercase tracking-wide"
          >
            Browse Skills
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-3 border-foreground text-foreground hover:bg-pop-cyan hover:text-foreground font-black text-lg px-8 py-6 shadow-[6px_6px_0_0_theme(colors.pop-pink)] hover:shadow-[2px_2px_0_0_theme(colors.pop-pink)] hover:translate-x-1 hover:translate-y-1 transition-all bg-card uppercase tracking-wide"
          >
            Submit Your Skill
          </Button>
        </div>

        {/* Works With - Agent compatibility */}
        <div className="max-w-4xl mx-auto py-6 px-4 border-3 border-foreground bg-foreground shadow-[6px_6px_0_0_theme(colors.foreground)]">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <span className="text-xs font-black text-pop-yellow uppercase tracking-widest whitespace-nowrap">
              Works with
            </span>
            <div className="flex flex-wrap justify-center gap-0">
              {[
                { name: "Claude Code", color: "bg-pop-pink" },
                { name: "Codex", color: "bg-pop-lime" },
                { name: "Cursor", color: "bg-pop-cyan" },
                { name: "OpenClaw", color: "bg-pop-orange" },
                { name: "Antigravity", color: "bg-pop-yellow" },
                { name: "Windsurf", color: "bg-pop-pink" },
                { name: "Aider", color: "bg-pop-lime" },
              ].map((agent) => (
                <div 
                  key={agent.name} 
                  className={`${agent.color} text-foreground text-xs font-black px-3 py-2 border border-foreground hover:scale-105 transition-transform cursor-default uppercase`}
                >
                  {agent.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

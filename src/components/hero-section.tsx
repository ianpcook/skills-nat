"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Copy, Check, Star, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

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

          {/* Right column - Featured Skill Card (Simplified) */}
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
              <div className="absolute top-0 right-0 flex z-10">
                <div className="bg-pop-yellow text-foreground font-black text-xs px-3 py-1 border-l-4 border-b-4 border-foreground uppercase flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  FEATURED
                </div>
              </div>

              {/* Header stripe with icon */}
              <div className="bg-foreground text-card p-4 flex items-center gap-3">
                <div className={`text-2xl ${colors.bgSolid} p-2 border-2 border-card`}>
                  {randomSkill.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-black uppercase truncate">{randomSkill.name}</h3>
                  <p className="text-xs opacity-70">by {randomSkill.author}</p>
                </div>
                <div className="flex items-center gap-1 text-card font-bold shrink-0">
                  <Star className="h-4 w-4 fill-pop-yellow text-pop-yellow" />
                  <span className="text-sm">{randomSkill.stars}</span>
                </div>
              </div>

              {/* Content area - simplified */}
              <div className="p-4 bg-card">
                {/* Description */}
                <p className="text-foreground text-sm mb-3 line-clamp-2">
                  {randomSkill.description}
                </p>

                {/* Category + Agents simplified */}
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-pop-pink text-foreground font-bold text-xs border-2 border-foreground uppercase">
                    {randomSkill.tags[0]}
                  </Badge>
                  <span className="text-xs font-bold text-muted-foreground">
                    {randomSkill.agents.length} agents
                  </span>
                </div>

                {/* PRIMARY ACTION: Install Command */}
                <button
                  onClick={handleSkillCopy}
                  className="w-full bg-foreground text-card p-3 border-2 border-foreground hover:bg-foreground/90 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-xs font-mono truncate flex-1 text-left">
                      <span className="text-pop-yellow">$</span> {randomSkill.installCommand}
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
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH - Added for task-oriented users */}
        <form action="/skills" method="GET" className="max-w-2xl mx-auto mb-10">
          <div className="flex gap-0">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground" />
              <input
                type="text"
                name="search"
                placeholder="Search for a skill..."
                className="w-full border-4 border-r-0 border-foreground bg-card py-4 pl-12 pr-4 text-foreground placeholder-muted-foreground font-bold focus:outline-none focus:bg-pop-yellow/20"
              />
            </div>
            <button
              type="submit"
              className="px-8 bg-pop-pink text-foreground font-black uppercase border-4 border-foreground shadow-[4px_4px_0_0_theme(colors.foreground)] hover:shadow-[2px_2px_0_0_theme(colors.foreground)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
            >
              <Search className="h-5 w-5" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </form>

        {/* CTA Buttons - simplified, secondary to search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
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

        {/* Works With - Agent compatibility (now functional) */}
        <div className="max-w-4xl mx-auto py-6 px-4 border-3 border-foreground bg-foreground shadow-[6px_6px_0_0_var(--color-foreground)]">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <span className="text-xs font-black text-pop-yellow uppercase tracking-widest whitespace-nowrap">
              Filter by agent
            </span>
            <div className="flex flex-wrap justify-center gap-0">
              {[
                { name: "Claude Code", id: "claude-code", color: "bg-pop-pink" },
                { name: "Codex", id: "codex", color: "bg-pop-lime" },
                { name: "Cursor", id: "cursor", color: "bg-pop-cyan" },
                { name: "OpenClaw", id: "openclaw", color: "bg-pop-orange" },
                { name: "Antigravity", id: "antigravity", color: "bg-pop-yellow" },
                { name: "Windsurf", id: "windsurf", color: "bg-pop-pink" },
                { name: "Aider", id: "aider", color: "bg-pop-lime" },
              ].map((agent) => (
                <Link
                  key={agent.id}
                  href={`/skills?agent=${agent.id}`}
                  className={`${agent.color} text-foreground text-xs font-black px-3 py-2 border border-foreground hover:scale-105 transition-transform uppercase`}
                >
                  {agent.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

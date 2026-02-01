"use client"

import { SkillCard, type Skill } from "@/components/skill-card"

const featuredSkills: Skill[] = [
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
    isFeatured: true,
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
    isFeatured: true,
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
    isFeatured: true,
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

export function FeaturedSkills() {
  return (
    <section id="featured" className="py-16 md:py-24 relative">
      {/* Warhol-style background quadrant - subtle */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-pop-pink" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-pop-cyan" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header - bold poster style */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-2 flex-1 bg-foreground" />
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
            <span className="text-pop-pink">Featured</span> Skills
          </h2>
          <div className="h-2 flex-1 bg-foreground" />
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  )
}

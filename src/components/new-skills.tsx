"use client"

import { SkillCard, type Skill } from "@/components/skill-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const newSkills: Skill[] = [
  {
    id: "n1",
    name: "Andy Warhol Museum API",
    description: "Access exhibit data, artwork information, and tour schedules from Pittsburgh's famous Andy Warhol Museum.",
    author: "pop_art_dev",
    authorLocation: "North Shore",
    installCommand: "npx skillsnat add @pgh/warhol-skill",
    tags: ["art", "museum", "culture"],
    agents: ["Claude Code", "Codex", "Cursor", "OpenClaw"],
    stars: 34,
    accentColor: "pink",
    icon: "🎨",
    isNew: true,
  },
  {
    id: "n2",
    name: "Incline Status",
    description: "Real-time status of the Duquesne and Monongahela Inclines. Know before you go if Mt. Washington is accessible.",
    author: "incline_io",
    authorLocation: "Mt. Washington",
    installCommand: "npx skillsnat add @pgh/incline-skill",
    tags: ["transit", "tourism", "real-time"],
    agents: ["Claude Code", "Cursor", "Antigravity"],
    stars: 28,
    accentColor: "orange",
    icon: "🚃",
    isNew: true,
  },
  {
    id: "n3",
    name: "Strip District Markets",
    description: "Search vendors, prices, and hours at the Strip District markets. Find that perfect cannoli or fresh fish.",
    author: "strip_coder",
    authorLocation: "Strip District",
    installCommand: "npx skillsnat add @pgh/strip-markets",
    tags: ["food", "shopping", "local"],
    agents: ["Claude Code", "Codex", "Continue"],
    stars: 19,
    accentColor: "lime",
    icon: "🛒",
    isNew: true,
  },
  {
    id: "n4",
    name: "Pittsburgh Bridge Tracker",
    description: "Status and history of all 446 bridges in Pittsburgh. Because we have more bridges than Venice.",
    author: "bridge_nerd",
    authorLocation: "Point Breeze",
    installCommand: "npx skillsnat add @pgh/bridges-skill",
    tags: ["infrastructure", "history", "data"],
    agents: ["Claude Code", "Codex", "Cursor", "OpenClaw", "Windsurf"],
    stars: 45,
    accentColor: "yellow",
    icon: "🌉",
    isNew: true,
  },
]

export function NewSkills() {
  return (
    <section id="new" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header - Pop Art Style (consistent with Featured Skills) */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-2 flex-1 bg-foreground" />
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
            <span className="text-pop-cyan">Fresh</span> Off the Press
          </h2>
          <div className="h-2 flex-1 bg-foreground" />
        </div>

        <p className="text-lg text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
          Hot new skills from Pittsburgh{"'"}s developer community. Baked fresh daily, just like Mancini{"'"}s bread.
        </p>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>

        {/* View All CTA - Pop Art Style */}
        <div className="mt-12 text-center">
          <Button
            size="lg"
            className="bg-pop-pink text-foreground hover:bg-pop-orange font-black uppercase text-lg px-8 py-6 border-3 border-foreground shadow-[6px_6px_0_0_theme(colors.foreground)] hover:shadow-[2px_2px_0_0_theme(colors.foreground)] hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            View All Skills
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}

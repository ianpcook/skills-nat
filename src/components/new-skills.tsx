"use client"

import { SkillCard } from "@/components/skill-card"
import { toDisplaySkill, type Skill, type BackendSkill } from "@/lib/skill-utils"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

export function NewSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNewSkills() {
      try {
        const res = await fetch('/api/skills?sort=new&limit=4')
        if (!res.ok) throw new Error('Failed to fetch skills')
        const data = await res.json()
        
        // Transform backend skills to display format and mark as new
        const displaySkills = data.skills.map((skill: BackendSkill) => ({
          ...toDisplaySkill(skill),
          isNew: true,
        }))
        
        setSkills(displaySkills)
      } catch {
        setError('Failed to load new skills')
      } finally {
        setLoading(false)
      }
    }

    fetchNewSkills()
  }, [])

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

        <p className="text-lg font-bold text-muted-foreground text-center mb-10 max-w-3xl mx-auto uppercase tracking-wide">
          Hot new skills from Pittsburgh{"'"}s developer community. Baked fresh daily, just like Mancini{"'"}s bread.
        </p>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-pop-cyan" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && skills.length === 0 && (
          <div className="text-center py-12 border-4 border-dashed border-foreground/30">
            <p className="text-xl font-bold text-muted-foreground mb-2">No new skills yet!</p>
            <p className="text-muted-foreground">Be the first to submit a skill to the registry.</p>
          </div>
        )}

        {/* Skills Grid */}
        {!loading && !error && skills.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill) => (
              <Link key={skill.id} href={`/skills/${skill.slug}`}>
                <SkillCard skill={skill} />
              </Link>
            ))}
          </div>
        )}

        {/* View All CTA - Pop Art Style */}
        <div className="mt-12 text-center">
          <Link href="/skills">
            <Button
              size="lg"
              className="bg-pop-pink text-foreground hover:bg-pop-orange font-black uppercase text-lg px-8 py-6 border-3 border-foreground shadow-[6px_6px_0_0_theme(colors.foreground)] hover:shadow-[2px_2px_0_0_theme(colors.foreground)] hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              View All Skills
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

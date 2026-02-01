"use client"

import { SkillCard, type Skill, type BackendSkill, toDisplaySkill } from "@/components/skill-card"
import { useEffect, useState } from "react"

export function FeaturedSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeaturedSkills() {
      try {
        const res = await fetch('/api/skills?featured=true&limit=6')
        if (!res.ok) throw new Error('Failed to fetch featured skills')
        const data = await res.json()
        const displaySkills = (data.skills as BackendSkill[]).map(s => ({
          ...toDisplaySkill(s),
          isFeatured: true,
        }))
        setSkills(displaySkills)
      } catch (err) {
        console.error('Error fetching featured skills:', err)
        setError(err instanceof Error ? err.message : 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedSkills()
  }, [])

  // Don't render section if no featured skills and not loading
  if (!loading && skills.length === 0 && !error) {
    return null
  }

  return (
    <section id="featured" className="pt-8 pb-16 md:pt-10 md:pb-24 relative">
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

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="border-4 border-foreground bg-pop-yellow/20 h-64 animate-pulse shadow-[6px_6px_0_0_theme(colors.foreground)]"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-lg font-bold text-pop-pink">{error}</p>
          </div>
        )}

        {/* Skills Grid */}
        {!loading && !error && skills.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

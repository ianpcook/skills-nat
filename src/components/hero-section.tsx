"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Copy, Check, Star, Search, ChevronRight, X, Loader2 } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { SkillCard, toDisplaySkill, type Skill, type BackendSkill } from "@/components/skill-card"
import { AGENTS, CATEGORIES } from "@/lib/constants"

const colorClasses: Record<string, { bg: string; bgSolid: string }> = {
  yellow: { bg: "bg-pop-yellow", bgSolid: "bg-pop-yellow" },
  pink: { bg: "bg-pop-pink", bgSolid: "bg-pop-pink" },
  cyan: { bg: "bg-pop-cyan", bgSolid: "bg-pop-cyan" },
  orange: { bg: "bg-pop-orange", bgSolid: "bg-pop-orange" },
  lime: { bg: "bg-pop-lime", bgSolid: "bg-pop-lime" },
}

interface SearchState {
  query: string
  category: string
  agent: string
}

interface SearchResults {
  skills: BackendSkill[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

interface HeroSectionProps {
  onSearchActiveChange?: (isActive: boolean) => void
}

export function HeroSection({ onSearchActiveChange }: HeroSectionProps) {
  const [skillCopied, setSkillCopied] = useState(false)
  const [featuredSkill, setFeaturedSkill] = useState<Skill | null>(null)
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true)

  // Search state
  const [searchState, setSearchState] = useState<SearchState>({ query: "", category: "", agent: "" })
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    // Fetch skills from database and pick a random one
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
      } catch (error) {
        console.error('Failed to fetch featured skill:', error)
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

  const colors = colorClasses[featuredSkill?.accentColor || 'yellow'] || colorClasses.yellow

  // Search function
  const performSearch = useCallback(async (state: SearchState) => {
    const { query, category, agent } = state
    
    // If all filters are empty, clear results
    if (!query && !category && !agent) {
      setSearchResults(null)
      setHasSearched(false)
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    try {
      const params = new URLSearchParams()
      if (query) params.set("search", query)
      if (category) params.set("category", category)
      if (agent) params.set("agent", agent)
      params.set("limit", "12")

      const res = await fetch(`/api/skills?${params}`)
      if (res.ok) {
        const data = await res.json()
        setSearchResults(data)
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchState)
  }

  const handleAgentFilter = (agentId: string) => {
    const newAgent = searchState.agent === agentId ? "" : agentId
    const newState = { ...searchState, agent: newAgent }
    setSearchState(newState)
    performSearch(newState)
  }

  const handleCategoryChange = (category: string) => {
    const newState = { ...searchState, category }
    setSearchState(newState)
    // Don't auto-search on category change, wait for submit
  }

  const clearSearch = () => {
    setSearchState({ query: "", category: "", agent: "" })
    setSearchResults(null)
    setHasSearched(false)
  }

  const isSearchActive = hasSearched || searchState.query || searchState.category || searchState.agent

  // Notify parent when search state changes
  useEffect(() => {
    onSearchActiveChange?.(hasSearched)
  }, [hasSearched, onSearchActiveChange])

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
            {isLoadingFeatured ? (
              <div className="w-full max-w-md border-4 border-foreground bg-card p-8 flex items-center justify-center">
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
                    <div className="flex items-center gap-1 text-card font-bold shrink-0">
                      <Star className="h-4 w-4 fill-pop-yellow text-pop-yellow" />
                      <span className="text-sm">{featuredSkill.stars}</span>
                    </div>
                  </div>

                  {/* Content area - simplified */}
                  <div className="p-4 bg-card">
                    {/* Description */}
                    <p className="text-foreground text-sm mb-3 line-clamp-2">
                      {featuredSkill.description}
                    </p>

                    {/* Category + Agents simplified */}
                    <div className="flex items-center gap-2 mb-4">
                      {featuredSkill.category && (
                        <Badge className="bg-pop-pink text-foreground font-bold text-xs border-2 border-foreground uppercase">
                          {featuredSkill.category}
                        </Badge>
                      )}
                      <span className="text-xs font-bold text-muted-foreground">
                        {featuredSkill.agents.length} agent{featuredSkill.agents.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* PRIMARY ACTION: Install Command */}
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
                  </div>
                </div>
              </Link>
            ) : null}
          </div>
        </div>

        {/* SEARCH - Inline with results */}
        <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto mb-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground" />
              <input
                type="text"
                value={searchState.query}
                onChange={(e) => setSearchState(s => ({ ...s, query: e.target.value }))}
                placeholder="Search for a skill..."
                className="w-full border-4 border-foreground bg-card py-4 pl-12 pr-4 text-foreground placeholder-muted-foreground font-bold focus:outline-none focus:bg-pop-yellow/20"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <select
                value={searchState.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full appearance-none border-4 border-foreground bg-card px-4 py-4 pr-10 text-foreground font-bold uppercase focus:outline-none focus:bg-pop-yellow/20 sm:w-48"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-foreground" />
            </div>
            
            <button
              type="submit"
              disabled={isSearching}
              className="px-8 bg-pop-pink text-foreground font-black uppercase border-4 border-foreground shadow-[4px_4px_0_0_theme(colors.foreground)] hover:shadow-[2px_2px_0_0_theme(colors.foreground)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSearching ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </form>

        {/* Active Filters Display */}
        {isSearchActive && (
          <div className="max-w-3xl mx-auto mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold uppercase text-muted-foreground">Filters:</span>
            {searchState.query && (
              <span className="border-2 border-foreground bg-pop-yellow px-3 py-1 text-sm font-bold text-foreground">
                &quot;{searchState.query}&quot;
              </span>
            )}
            {searchState.category && (
              <span className="border-2 border-foreground bg-pop-cyan px-3 py-1 text-sm font-bold text-foreground">
                {searchState.category}
              </span>
            )}
            {searchState.agent && (
              <span className="border-2 border-foreground bg-pop-lime px-3 py-1 text-sm font-bold text-foreground">
                {AGENTS.find(a => a.id === searchState.agent)?.name || searchState.agent}
              </span>
            )}
            <button
              onClick={clearSearch}
              className="flex items-center gap-1 text-sm font-bold uppercase text-pop-pink hover:underline"
            >
              <X className="h-4 w-4" />
              Clear all
            </button>
          </div>
        )}

        {/* Works With - Agent compatibility (now functional filtering) */}
        <div className="max-w-4xl mx-auto py-6 px-4 border-3 border-foreground bg-foreground shadow-[6px_6px_0_0_var(--color-foreground)] mb-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <span className="text-xs font-black text-pop-yellow uppercase tracking-widest whitespace-nowrap">
              Filter by agent
            </span>
            <div className="flex flex-wrap justify-center gap-0">
              {AGENTS.map((agent) => {
                const isActive = searchState.agent === agent.id
                return (
                  <button
                    key={agent.id}
                    onClick={() => handleAgentFilter(agent.id)}
                    className={`text-xs font-black px-3 py-2 border border-foreground hover:scale-105 transition-transform uppercase ${
                      isActive
                        ? 'bg-card text-foreground ring-2 ring-pop-yellow ring-offset-1'
                        : 'bg-pop-pink text-foreground'
                    }`}
                  >
                    {agent.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* INLINE SEARCH RESULTS */}
        {hasSearched && (
          <div className="mb-12">
            {isSearching ? (
              <div className="py-20 text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-pop-pink mb-4" />
                <p className="text-lg font-bold uppercase text-muted-foreground">Searching...</p>
              </div>
            ) : searchResults && searchResults.skills.length > 0 ? (
              <>
                {/* Results Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-1 flex-1 bg-foreground" />
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                    <span className="text-pop-pink">Search</span> Results
                  </h2>
                  <div className="h-1 flex-1 bg-foreground" />
                </div>
                
                <p className="text-center text-sm text-muted-foreground mb-6">
                  Found {searchResults.pagination.total} skill{searchResults.pagination.total !== 1 ? 's' : ''}
                </p>

                {/* Results Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {searchResults.skills.map((skill) => (
                    <Link key={skill.id} href={`/skills/${skill.slug}`}>
                      <SkillCard skill={toDisplaySkill(skill)} />
                    </Link>
                  ))}
                </div>

                {/* View More Link */}
                {searchResults.pagination.total > 12 && (
                  <div className="mt-8 text-center">
                    <Link
                      href={`/skills?search=${searchState.query}&category=${searchState.category}&agent=${searchState.agent}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-pop-cyan text-foreground font-black uppercase border-3 border-foreground shadow-[4px_4px_0_0_theme(colors.foreground)] hover:shadow-[2px_2px_0_0_theme(colors.foreground)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                      View All {searchResults.pagination.total} Results
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border-4 border-foreground bg-pop-yellow shadow-[4px_4px_0_0_theme(colors.foreground)]">
                  <Search className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="text-xl font-black uppercase text-foreground">
                  No skills found
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={clearSearch}
                  className="mt-4 text-sm font-bold uppercase text-pop-pink hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* CTA Buttons - only show when not searching */}
        {!hasSearched && (
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
        )}
      </div>
    </section>
  )
}

// Export for homepage to conditionally show other sections
export function useHeroSearchState() {
  return { hasSearched: false } // This would need proper state management for cross-component use
}

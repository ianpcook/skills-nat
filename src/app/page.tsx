"use client"

import { useState } from "react"
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FeaturedSkills } from "@/components/featured-skills";
import { NewSkills } from "@/components/new-skills";
import { Footer } from "@/components/footer";
import { OAuthRedirectHandler } from "@/components/oauth-redirect-handler";

export default function Home() {
  const [isSearchActive, setIsSearchActive] = useState(false)

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <OAuthRedirectHandler />
      
      {/* Warhol-style halftone dots pattern */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)`,
          backgroundSize: '8px 8px'
        }} 
      />
      
      <div className="relative z-10">
        <Header />
        <HeroSection onSearchActiveChange={setIsSearchActive} />
        
        {/* Only show Featured and New sections when not searching */}
        {!isSearchActive && (
          <>
            <FeaturedSkills />
            <NewSkills />
          </>
        )}
        
        {/* Stats - Warhol quadrant style - always visible */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-3 gap-0 border-3 border-foreground overflow-hidden shadow-[8px_8px_0_0_theme(colors.foreground)]">
                <div className="bg-pop-pink p-6 md:p-8 text-center border-r-3 border-foreground">
                  <div className="text-4xl md:text-5xl font-black text-foreground">24+</div>
                  <div className="text-sm font-bold text-foreground/80 mt-1 uppercase tracking-wide">Skills</div>
                </div>
                <div className="bg-pop-cyan p-6 md:p-8 text-center border-r-3 border-foreground">
                  <div className="text-4xl md:text-5xl font-black text-foreground">6</div>
                  <div className="text-sm font-bold text-foreground/80 mt-1 uppercase tracking-wide">Agents</div>
                </div>
                <div className="bg-pop-lime p-6 md:p-8 text-center">
                  <div className="text-4xl md:text-5xl font-black text-foreground">412</div>
                  <div className="text-sm font-bold text-foreground/80 mt-1 uppercase tracking-wide">Devs</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </main>
  );
}

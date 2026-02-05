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
        
        <Footer />
      </div>
    </main>
  );
}

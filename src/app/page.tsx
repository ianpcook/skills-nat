import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { AgentsList } from "@/components/agents-list";
import { WhatAreSkills } from "@/components/what-are-skills";
import { FeaturedSkills } from "@/components/featured-skills";
import { RecentlyUpdated } from "@/components/recently-updated";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { OAuthRedirectHandler } from "@/components/oauth-redirect-handler";

// Force dynamic rendering to always fetch fresh skills data
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <OAuthRedirectHandler />
      <Header />
      <main>
        <HeroSection />
        <AgentsList />
        <WhatAreSkills />
        <FeaturedSkills />
        <RecentlyUpdated />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

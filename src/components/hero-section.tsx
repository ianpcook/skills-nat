"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { ChatDemo } from "@/components/chat-demo"

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-6 md:pt-20 md:pb-8 overflow-hidden">
      {/* Warhol-style color block background */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 pointer-events-none opacity-[0.08]">
        <div className="bg-pop-pink" />
        <div className="bg-pop-cyan" />
        <div className="bg-pop-lime" />
        <div className="bg-pop-orange" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
          {/* Left column - Hero text + CTAs */}
          <div className="text-center lg:text-left">
            {/* Badge with pop-art styling */}
            <div className="inline-flex items-center gap-2 px-6 py-3 border-3 border-foreground bg-pop-pink text-foreground text-base md:text-lg font-bold mb-6 shadow-[4px_4px_0_0_theme(colors.foreground)]">
              <Sparkles className="h-5 w-5" />
              <span>Made in Pittsburgh, for the world</span>
            </div>

            {/* Main headline */}
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

            <p className="text-base md:text-lg text-foreground/80 max-w-xl mx-auto lg:mx-0 mt-4">
              Give any chatbot expertise and focus by adding specialized instructions, with a simple install command or file addition in the interface.
            </p>

            {/* CTA Buttons - in left column */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mt-8">
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
          </div>

          {/* Right column - Chat Demo */}
          <div className="flex justify-center lg:justify-end">
            <ChatDemo />
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Copy, Check, Terminal } from "lucide-react"
import { useState } from "react"

const codeExample = `# Install any skill with one command
npx skillsnat add @pgh/transit-skill

# Or use with your favorite agent
claude-code --skill @pgh/transit-skill
cursor --install-skill @pgh/pierogi-skill`;

export function HeroSection() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeExample)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      {/* Warhol-style color block background - inspired by the cat/dog quadrants */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 pointer-events-none opacity-[0.08]">
        <div className="bg-pop-pink" />
        <div className="bg-pop-cyan" />
        <div className="bg-pop-lime" />
        <div className="bg-pop-orange" />
      </div>

      {/* Stylized bridge silhouette - Pittsburgh's iconic yellow bridges */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1200 120" className="w-full h-24 md:h-32" preserveAspectRatio="none">
          {/* Bridge suspension cables */}
          <path 
            d="M0 120 L0 80 Q100 40 200 60 Q300 80 400 50 Q500 20 600 40 Q700 60 800 30 Q900 0 1000 50 Q1100 100 1200 60 L1200 120 Z" 
            className="fill-pop-yellow"
          />
          {/* Bridge deck */}
          <rect x="0" y="100" width="1200" height="20" className="fill-pop-yellow" />
          {/* Tower silhouettes */}
          <rect x="200" y="40" width="20" height="60" className="fill-pop-orange" />
          <rect x="500" y="20" width="24" height="80" className="fill-pop-orange" />
          <rect x="800" y="30" width="20" height="70" className="fill-pop-orange" />
          <rect x="1000" y="50" width="18" height="50" className="fill-pop-orange" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge with pop-art styling */}
          <div className="inline-flex items-center gap-2 px-5 py-2 border-3 border-foreground bg-pop-pink text-foreground text-sm font-bold mb-8 shadow-[4px_4px_0_0_theme(colors.foreground)]">
            <Sparkles className="h-4 w-4" />
            <span>Made in Pittsburgh, for the world</span>
          </div>

          {/* Main headline - bold like the poster text */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 uppercase">
            <span className="text-foreground">Skills</span>
            <br />
            <span 
              className="relative inline-block text-pop-yellow"
              style={{ 
                WebkitTextStroke: '3px currentColor',
                textShadow: '4px 4px 0 var(--pop-pink), 8px 8px 0 var(--pop-cyan)'
              }}
            >
              N{"'"}at
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            AI coding skills built by Pittsburgh{"'"}s finest developers, 
            researchers, and makers. One command to install, endless possibilities.
          </p>

          {/* CTA Buttons - bold pop-art style */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-pop-yellow text-foreground hover:bg-pop-orange font-black text-lg px-8 py-6 border-3 border-foreground shadow-[6px_6px_0_0_theme(colors.foreground)] hover:shadow-[2px_2px_0_0_theme(colors.foreground)] hover:translate-x-1 hover:translate-y-1 transition-all uppercase tracking-wide"
            >
              Browse Skills
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-3 border-foreground text-foreground hover:bg-pop-cyan hover:text-foreground font-black text-lg px-8 py-6 shadow-[6px_6px_0_0_theme(colors.pop-pink)] hover:shadow-[2px_2px_0_0_theme(colors.pop-pink)] hover:translate-x-1 hover:translate-y-1 transition-all bg-card uppercase tracking-wide"
            >
              Submit Your Skill
            </Button>
          </div>

          {/* Quick Install Terminal - moved up here */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-foreground translate-x-3 translate-y-3 transition-transform group-hover:translate-x-4 group-hover:translate-y-4" />
              <div className="relative border-4 border-foreground bg-pop-pink overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-foreground text-background">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    <span className="font-black uppercase text-sm">
                      Quick Install
                    </span>
                  </div>
                  <button
                    className="hover:scale-110 transition-transform"
                    onClick={handleCopy}
                    aria-label="Copy install commands"
                  >
                    {copied ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <pre className="p-5 overflow-x-auto text-sm bg-card text-left">
                  <code className="font-mono">
                    {codeExample.split("\n").map((line, i) => (
                      <div key={i} className="leading-relaxed">
                        {line.startsWith("#") ? (
                          <span className="text-muted-foreground">{line}</span>
                        ) : line.startsWith("npx") ||
                          line.startsWith("claude") ||
                          line.startsWith("cursor") ? (
                          <>
                            <span className="text-pop-pink font-bold">
                              {line.split(" ")[0]}
                            </span>
                            <span className="text-foreground">
                              {" "}
                              {line.split(" ").slice(1).join(" ")}
                            </span>
                          </>
                        ) : (
                          <span className="text-foreground">{line}</span>
                        )}
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>
          </div>

          {/* Stats - Warhol quadrant style */}
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
  )
}

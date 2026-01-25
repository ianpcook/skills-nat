"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sprocket } from "@/components/sprocket";
import { Check, Copy } from "lucide-react";

const PITTSBURGH_IMAGE = "/images/pittsburgh-sunset.jpeg";

export function HeroSection() {
  const [copied, setCopied] = useState(false);
  const installCommand = "npx skills add skillshq/github-skill";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-x-clip">
      {/* Geometric design - positioned absolutely to bleed off right edge */}
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[50vw] hidden lg:block">
        <Sprocket imageSrc={PITTSBURGH_IMAGE} />
      </div>
      
      <div className="relative z-10 px-6 py-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl lg:max-w-lg">
            <h1 className="mb-6 font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl text-balance">
              Skills for your{" "}
              <span className="text-foreground/70">AI agents</span>, n'at
            </h1>
            <p className="mb-10 font-sans text-lg leading-relaxed text-foreground/80">
              Discover, share, and install skills for Claude Code, Cursor, Codex,
              and more. Extend your AI assistant with powerful integrations built by
              the community.
            </p>
          </div>
          
          {/* Mobile sprocket */}
          <div className="lg:hidden mb-10 -mx-6">
            <Sprocket imageSrc={PITTSBURGH_IMAGE} />
          </div>
          
          <div className="max-w-xl lg:max-w-lg">
            <div className="mb-10 flex flex-col items-start gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="w-full bg-foreground px-8 text-background hover:bg-foreground/90 sm:w-auto"
              >
                <Link href="/skills">Browse Skills</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background sm:w-auto"
              >
                <Link href="/submit">Submit Your Skill</Link>
              </Button>
            </div>
            <div className="border border-foreground/20 bg-foreground/5">
              <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-2">
                <span className="text-xs text-foreground/60">Install a skill</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-foreground/60 hover:text-foreground"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="px-4 py-3">
                <code className="font-mono text-sm text-foreground">
                  {installCommand}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

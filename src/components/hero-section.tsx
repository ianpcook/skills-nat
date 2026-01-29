"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BridgeIllustration } from "@/components/bridge-illustration";
import { Check, Copy } from "lucide-react";

export function HeroSection() {
  const [copied, setCopied] = useState(false);
  const installCommand = "npm install skills-nat";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden min-h-[600px] lg:min-h-[700px]">
      {/* Bridge illustration - positioned to bleed off right edge */}
      <div className="absolute inset-0 hidden lg:block">
        <BridgeIllustration className="absolute top-1/2 -translate-y-1/2 right-0 w-[70vw] h-auto max-h-[800px] translate-x-[15%]" />
      </div>

      {/* Content layer */}
      <div className="relative z-10 px-6 py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl lg:max-w-lg">
            <h1 className="mb-6 font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl text-balance">
              Skills for your{" "}
              <span className="text-muted-foreground">AI agents</span>, n'at
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
              Discover and integrate premium AI skills for Claude Code, Cursor,
              and Codex.
            </p>
          </div>

          {/* Mobile bridge illustration */}
          <div className="lg:hidden mb-10 -mx-6 overflow-hidden">
            <BridgeIllustration className="w-full h-auto max-h-[300px]" />
          </div>

          <div className="max-w-xl lg:max-w-md">
            {/* Terminal block - macOS style */}
            <div className="terminal mb-8">
              <div className="terminal-header">
                <span className="terminal-dot terminal-dot-red" />
                <span className="terminal-dot terminal-dot-yellow" />
                <span className="terminal-dot terminal-dot-green" />
              </div>
              <div className="flex items-center justify-between px-4 py-4">
                <code className="font-mono text-sm text-white/90">
                  {installCommand}
                </code>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
                  aria-label="Copy command"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Agent badges */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <AgentBadge name="Claude Code" icon={<ClaudeIcon />} />
              <AgentBadge name="Cursor" icon={<CursorIcon />} />
              <AgentBadge name="Codex" icon={<CodexIcon />} />
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="w-full btn-primary sm:w-auto"
              >
                <Link href="/skills">Browse Skills</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full btn-outline sm:w-auto"
              >
                <Link href="/submit">Submit Your Skill</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Agent badge component
interface AgentBadgeProps {
  name: string;
  icon: React.ReactNode;
}

const AgentBadge = ({ name, icon }: AgentBadgeProps) => (
  <div className="flex items-center gap-2 bg-white rounded-md px-3 py-1.5 shadow-sm border border-border">
    {icon}
    <span className="text-sm font-medium text-foreground">{name}</span>
  </div>
);

// Mini agent icons
const ClaudeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="9" fill="#D97757" />
    <path
      d="M12.5 10C12.5 11.38 11.38 12.5 10 12.5C8.62 12.5 7.5 11.38 7.5 10C7.5 8.62 8.62 7.5 10 7.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const CursorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <rect width="20" height="20" rx="4" fill="#0D0D0D" />
    <path d="M6 5L6 14L9 11L12 15L14 14L11 10L14 10L6 5Z" fill="white" />
  </svg>
);

const CodexIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 1L18 5.5V14.5L10 19L2 14.5V5.5L10 1Z"
      fill="#10A37F"
    />
    <path
      d="M10 6V14M7 8L10 6L13 8M7 12L10 14L13 12"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

"use client";

import Link from "next/link";
import { Github } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background px-6">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-foreground px-3 py-1.5">
              <span className="font-serif text-lg font-bold text-background">
                AI@Skills
              </span>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:underline hover:underline-offset-4"
            >
              Home
            </Link>
            <Link
              href="/skills"
              className="text-sm font-medium text-foreground hover:underline hover:underline-offset-4"
            >
              Browse
            </Link>
            <Link
              href="/submit"
              className="text-sm font-medium text-foreground hover:underline hover:underline-offset-4"
            >
              Submit
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/ai-at-skills"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:opacity-70"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href="/submit"
            className="bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90"
          >
            Submit Skill
          </Link>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
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
              className="text-sm font-medium text-foreground underline underline-offset-4"
            >
              Home
            </Link>
            {/* TODO: /search page doesn't exist yet - currently using /skills for browsing */}
            <Link
              href="/search"
              className="text-sm font-medium text-foreground hover:underline hover:underline-offset-4"
            >
              Search
            </Link>
            {/* TODO: /faves page doesn't exist yet - needs user favorites functionality */}
            <Link
              href="/faves"
              className="text-sm font-medium text-foreground hover:underline hover:underline-offset-4"
            >
              Faves
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:opacity-70"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          {/* TODO: /docs page doesn't exist yet */}
          <Link
            href="/docs"
            className="bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90"
          >
            Docs
          </Link>
        </div>
      </div>
    </header>
  );
}

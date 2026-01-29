"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, KeyRound } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm px-6">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="logo-box">
              <span>Skills N'at</span>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/skills" className="nav-link">
              Browse Skills
            </Link>
            <Link href="/submit" className="nav-link">
              For Creators
            </Link>
            <Link href="/docs" className="nav-link">
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Admin"
          >
            <KeyRound className="h-5 w-5" />
            <span className="sr-only">Admin</span>
          </Link>
          <Link
            href="https://github.com/ianpcook/skills-nat"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="/docs">
            <Button className="btn-primary text-sm">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

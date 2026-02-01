"use client"

import Link from "next/link"
import { Github, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t-4 border-pop-yellow bg-card/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <svg 
                viewBox="0 0 48 32" 
                className="h-8 w-12 text-pop-yellow"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M4 28 L12 8 L24 4 L36 8 L44 28" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="0" y1="28" x2="48" y2="28" strokeLinecap="round" />
                <line x1="12" y1="8" x2="12" y2="28" />
                <line x1="24" y1="4" x2="24" y2="28" />
                <line x1="36" y1="8" x2="36" y2="28" />
              </svg>
              <span className="text-xl font-bold">
                <span className="text-pop-yellow">Skills</span>
                <span className="text-foreground"> N{"'"}at</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-4">
              AI agent skills built by Pittsburgh{"'"}s finest, n{"'"}at. Open source, community-driven, 
              and as strong as the steel that built this city.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/ianpcook/skills-nat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-pop-yellow transition-colors"
                aria-label="GitHub repository"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/skillsnat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-pop-cyan transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-pop-pink mb-4 uppercase">Skills</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/skills" className="text-muted-foreground hover:text-pop-pink transition-colors">
                  Browse All
                </Link>
              </li>
              <li>
                <Link href="/skills?category=API" className="text-muted-foreground hover:text-pop-pink transition-colors">
                  API Skills
                </Link>
              </li>
              <li>
                <Link href="/skills?category=Data" className="text-muted-foreground hover:text-pop-pink transition-colors">
                  Data Skills
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-muted-foreground hover:text-pop-pink transition-colors">
                  Submit Skill
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-pop-cyan mb-4 uppercase">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-pop-cyan transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <a href="https://github.com/ianpcook/skills-nat" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-pop-cyan transition-colors">
                  GitHub Repo
                </a>
              </li>
              <li>
                <a href="https://github.com/ianpcook/skills-nat/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-pop-cyan transition-colors">
                  Contributing
                </a>
              </li>
              <li>
                <a href="https://github.com/ianpcook/skills-nat/issues" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-pop-cyan transition-colors">
                  Report Issue
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Skills N{"'"}at. Built with love in Pittsburgh, PA.
          </p>
          <div className="flex items-center gap-2">
            {/* Warhol-style decorative dots */}
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-pop-yellow" />
              <div className="w-3 h-3 rounded-full bg-pop-pink" />
              <div className="w-3 h-3 rounded-full bg-pop-cyan" />
              <div className="w-3 h-3 rounded-full bg-pop-orange" />
              <div className="w-3 h-3 rounded-full bg-pop-lime" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

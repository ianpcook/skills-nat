"use client"

import { Button } from "@/components/ui/button"
import { Github, Menu, X } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b-4 border-foreground bg-pop-yellow">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Stylized bridge icon */}
            <div className="relative">
              <svg 
                viewBox="0 0 48 32" 
                className="h-10 w-14"
                fill="none"
              >
                {/* Bridge arch - bold strokes */}
                <path 
                  d="M2 28 L10 10 L24 4 L38 10 L46 28" 
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-foreground"
                />
                {/* Bridge deck */}
                <line x1="0" y1="28" x2="48" y2="28" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-foreground" />
                {/* Vertical supports */}
                <line x1="10" y1="10" x2="10" y2="28" stroke="currentColor" strokeWidth="3" className="text-pop-pink" />
                <line x1="24" y1="4" x2="24" y2="28" stroke="currentColor" strokeWidth="3" className="text-pop-pink" />
                <line x1="38" y1="10" x2="38" y2="28" stroke="currentColor" strokeWidth="3" className="text-pop-pink" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight uppercase">
              <span className="text-foreground">Skills</span>
              <span className="text-pop-pink"> N{"'"}at</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: "#featured", label: "Featured", color: "bg-pop-pink" },
              { href: "#new", label: "New Skills", color: "bg-pop-cyan" },
              { href: "#install", label: "Install", color: "bg-pop-lime" },
              { href: "#agents", label: "Agents", color: "bg-pop-orange" },
            ].map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={`text-sm font-bold text-foreground px-4 py-2 border-2 border-transparent hover:border-foreground hover:${item.color} transition-all uppercase`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button 
              size="sm" 
              className="hidden sm:flex bg-foreground text-pop-yellow hover:bg-pop-pink hover:text-foreground font-bold border-2 border-foreground shadow-[3px_3px_0_0_theme(colors.pop-pink)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase"
              asChild
            >
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                Submit
              </a>
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground hover:bg-pop-pink border-2 border-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 border-foreground py-4">
            <nav className="flex flex-col gap-2">
              {[
                { href: "#featured", label: "Featured", color: "bg-pop-pink" },
                { href: "#new", label: "New Skills", color: "bg-pop-cyan" },
                { href: "#install", label: "Install", color: "bg-pop-lime" },
                { href: "#agents", label: "Agents", color: "bg-pop-orange" },
              ].map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`text-sm font-bold text-foreground px-4 py-3 border-2 border-foreground ${item.color} uppercase`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button 
                size="sm" 
                className="w-fit bg-foreground text-pop-yellow hover:bg-pop-pink hover:text-foreground font-bold border-2 border-foreground uppercase mt-2"
                asChild
              >
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  Submit Skill
                </a>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

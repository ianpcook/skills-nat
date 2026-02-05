import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  BookOpen,
  Download,
  Upload,
  FileText,
  Lightbulb,
  Terminal,
  Puzzle,
  Check,
  ArrowRight,
  Github,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        {/* Hero Section - Pop Art Style */}
        <section className="border-b-4 border-foreground px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 bg-pop-pink border-4 border-foreground px-4 py-2 shadow-[4px_4px_0_0_var(--color-foreground)]">
              <BookOpen className="h-5 w-5 text-foreground" />
              <span className="font-black uppercase text-foreground">
                Documentation
              </span>
            </div>
            <h1 className="mb-6 text-4xl font-black uppercase text-foreground md:text-5xl lg:text-6xl">
              Learn to use <span className="text-pop-cyan">Skills</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Everything you need to know about finding, installing, creating,
              and sharing skills for your AI coding agents.
            </p>
          </div>
        </section>

        {/* Quick Nav - Pop Art Style */}
        <section className="border-b-4 border-foreground bg-pop-yellow px-6 py-6">
          <div className="mx-auto max-w-4xl">
            <nav className="flex flex-wrap justify-center gap-2">
              <a
                href="#what-are-skills"
                className="flex items-center gap-2 border-2 border-foreground bg-card px-4 py-2 text-sm font-bold uppercase text-foreground hover:bg-pop-pink transition-colors"
              >
                <Puzzle className="h-4 w-4" />
                What Are Skills?
              </a>
              <a
                href="#installing"
                className="flex items-center gap-2 border-2 border-foreground bg-card px-4 py-2 text-sm font-bold uppercase text-foreground hover:bg-pop-cyan transition-colors"
              >
                <Download className="h-4 w-4" />
                Installing
              </a>
              <a
                href="#submitting"
                className="flex items-center gap-2 border-2 border-foreground bg-card px-4 py-2 text-sm font-bold uppercase text-foreground hover:bg-pop-lime transition-colors"
              >
                <Upload className="h-4 w-4" />
                Submitting
              </a>
              <a
                href="#skill-md"
                className="flex items-center gap-2 border-2 border-foreground bg-card px-4 py-2 text-sm font-bold uppercase text-foreground hover:bg-pop-orange transition-colors"
              >
                <FileText className="h-4 w-4" />
                SKILL.md
              </a>
              <a
                href="#best-practices"
                className="flex items-center gap-2 border-2 border-foreground bg-card px-4 py-2 text-sm font-bold uppercase text-foreground hover:bg-pop-pink transition-colors"
              >
                <Lightbulb className="h-4 w-4" />
                Best Practices
              </a>
            </nav>
          </div>
        </section>

        {/* What Are Skills Section */}
        <section id="what-are-skills" className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center bg-pop-pink border-4 border-foreground">
                <Puzzle className="h-6 w-6 text-foreground" />
              </div>
              <h2 className="text-3xl font-black uppercase text-foreground md:text-4xl">
                What Are Skills?
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Skills are <strong className="text-foreground">reusable capabilities</strong> for AI coding
                agents. Unlike static documentation or simple prompts, skills
                provide <em>procedural knowledge</em>—they teach your AI assistant{" "}
                <strong className="text-foreground">how to do things</strong>, not just facts about things.
              </p>

              <div className="border-4 border-foreground bg-pop-cyan p-6 shadow-[4px_4px_0_0_var(--color-foreground)]">
                <h3 className="mb-4 text-xl font-black uppercase text-foreground">
                  Think of skills like plugins for your AI
                </h3>
                <p className="text-foreground">
                  Just as browser extensions add new features to Chrome, skills
                  add new capabilities to AI agents. They come with
                  instructions, scripts, and configurations that enable your
                  agent to interact with external services and automate complex
                  workflows.
                </p>
              </div>

              <h3 className="mt-8 text-xl font-black uppercase text-foreground">
                Example Skills
              </h3>
              <ul className="space-y-3">
                {[
                  { title: "GitHub integration", desc: "Create issues, open PRs, manage repositories" },
                  { title: "Weather APIs", desc: "Fetch forecasts and conditions from any location" },
                  { title: "Database management", desc: "Query, backup, and migrate databases" },
                  { title: "Deployment automation", desc: "Deploy to Vercel, AWS, Railway, and more" },
                  { title: "Notification services", desc: "Send Slack messages, emails, or SMS alerts" },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3 text-muted-foreground">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center bg-pop-lime border-2 border-foreground">
                      <Check className="h-3 w-3 text-foreground" />
                    </div>
                    <span>
                      <strong className="text-foreground">{item.title}</strong> — {item.desc}
                    </span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 text-xl font-black uppercase text-foreground">
                Cross-Agent Compatibility
              </h3>
              <p className="text-muted-foreground mb-4">
                Skills are designed to work across multiple AI coding agents:
              </p>
              <div className="flex flex-wrap gap-0">
                {[
                  { name: "Claude Code", color: "bg-pop-pink" },
                  { name: "Cursor", color: "bg-pop-cyan" },
                  { name: "Codex", color: "bg-pop-lime" },
                  { name: "Windsurf", color: "bg-pop-orange" },
                  { name: "Aider", color: "bg-pop-yellow" },
                  { name: "GitHub Copilot", color: "bg-pop-pink" },
                ].map((agent) => (
                  <span
                    key={agent.name}
                    className={`${agent.color} border border-foreground px-3 py-2 text-xs font-black uppercase text-foreground`}
                  >
                    {agent.name}
                  </span>
                ))}
              </div>

              <h3 className="mt-8 text-xl font-black uppercase text-foreground">
                Anatomy of a Skill
              </h3>
              <p className="mb-4 text-muted-foreground">
                At minimum, every skill contains a <code className="border border-foreground bg-pop-yellow px-2 py-0.5 text-sm font-bold">SKILL.md</code> file.
                More complex skills include additional scripts and configurations:
              </p>
              <div className="border-4 border-foreground shadow-[4px_4px_0_0_var(--color-foreground)]">
                <div className="bg-foreground px-3 py-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-pop-pink" />
                  <span className="w-3 h-3 bg-pop-yellow" />
                  <span className="w-3 h-3 bg-pop-lime" />
                </div>
                <div className="bg-foreground text-card p-4">
                  <pre className="font-mono text-sm">
{`my-skill/
├── SKILL.md          # Required: skill definition & docs
├── scripts/
│   ├── setup.sh      # Optional: installation script
│   └── run.py        # Optional: execution script
├── config/
│   └── settings.json # Optional: configuration
└── examples/
    └── usage.md      # Optional: usage examples`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Installing Skills Section */}
        <section
          id="installing"
          className="border-t-4 border-foreground bg-pop-yellow/20 px-6 py-16 md:py-24"
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center bg-pop-cyan border-4 border-foreground">
                <Download className="h-6 w-6 text-foreground" />
              </div>
              <h2 className="text-3xl font-black uppercase text-foreground md:text-4xl">
                Installing Skills for Claude Desktop
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-muted-foreground">
                There are two ways to install skills in Claude Desktop: using the built-in GUI or manually placing files.
                Once installed, skills become available as slash commands.
              </p>

              {/* GUI Method */}
              <div className="border-4 border-foreground bg-pop-pink p-6 shadow-[4px_4px_0_0_var(--color-foreground)]">
                <h3 className="text-xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
                  <span className="bg-foreground text-card px-2 py-1 text-sm">Option A</span>
                  Using the GUI (Recommended)
                </h3>
                <ol className="space-y-4 text-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-foreground text-card text-sm font-black">1</span>
                    <span>Open <strong>Claude Desktop</strong> and go to <strong>Settings</strong> (gear icon)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-foreground text-card text-sm font-black">2</span>
                    <span>Click on <strong>Capabilities</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-foreground text-card text-sm font-black">3</span>
                    <span>Scroll down to the <strong>Skills</strong> section</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-foreground text-card text-sm font-black">4</span>
                    <span>Click the <strong>+</strong> button to add a new skill</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-foreground text-card text-sm font-black">5</span>
                    <span>Upload the <code className="bg-foreground text-card px-1 py-0.5 text-xs font-bold">SKILL.md</code> file (and any additional files)</span>
                  </li>
                </ol>
              </div>

              {/* Manual Method */}
              <div className="border-4 border-foreground bg-card p-6 shadow-[4px_4px_0_0_var(--color-foreground)]">
                <h3 className="text-xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
                  <span className="bg-pop-cyan text-foreground border-2 border-foreground px-2 py-1 text-sm">Option B</span>
                  Manual Installation
                </h3>
                <p className="text-muted-foreground mb-4">
                  For power users, you can manually place skill files in Claude&apos;s commands directory.
                </p>

                <h4 className="font-black uppercase text-foreground mt-6 mb-3">Global Skills (all projects)</h4>
                <div className="border-4 border-foreground shadow-[4px_4px_0_0_var(--color-foreground)]">
                  <div className="bg-foreground px-3 py-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-pop-pink" />
                    <span className="w-3 h-3 bg-pop-yellow" />
                    <span className="w-3 h-3 bg-pop-lime" />
                  </div>
                  <div className="bg-foreground text-card p-4 font-mono text-sm">
                    <p className="text-card/50"># Create the directory and add your skill</p>
                    <p><span className="text-pop-yellow">$</span> mkdir -p ~/.claude/commands</p>
                    <p><span className="text-pop-yellow">$</span> cp weather.md ~/.claude/commands/</p>
                  </div>
                </div>

                <h4 className="font-black uppercase text-foreground mt-6 mb-3">Project-Specific Skills</h4>
                <div className="border-4 border-foreground shadow-[4px_4px_0_0_var(--color-foreground)]">
                  <div className="bg-foreground px-3 py-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-pop-pink" />
                    <span className="w-3 h-3 bg-pop-yellow" />
                    <span className="w-3 h-3 bg-pop-lime" />
                  </div>
                  <div className="bg-foreground text-card p-4 font-mono text-sm">
                    <p className="text-card/50"># In your project root</p>
                    <p><span className="text-pop-yellow">$</span> mkdir -p .claude/commands</p>
                    <p><span className="text-pop-yellow">$</span> cp deploy.md .claude/commands/</p>
                  </div>
                </div>
              </div>

              <h3 className="mt-8 text-xl font-black uppercase text-foreground">
                Using Your Installed Skill
              </h3>
              <p className="text-muted-foreground mb-4">
                Once installed, type the slash command (the filename without .md) to invoke the skill:
              </p>

              <div className="border-4 border-foreground bg-pop-cyan p-6 shadow-[4px_4px_0_0_var(--color-foreground)]">
                <p className="text-foreground font-bold mb-2">Example usage:</p>
                <code className="bg-foreground text-card px-3 py-2 block font-mono">/weather Pittsburgh</code>
                <p className="text-foreground/80 mt-3 text-sm">
                  Claude will read the skill instructions and execute the task accordingly.
                </p>
              </div>

              <h3 className="mt-8 text-xl font-black uppercase text-foreground">
                Directory Structure
              </h3>
              <div className="border-4 border-foreground shadow-[4px_4px_0_0_var(--color-foreground)]">
                <div className="bg-foreground px-3 py-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-pop-pink" />
                  <span className="w-3 h-3 bg-pop-yellow" />
                  <span className="w-3 h-3 bg-pop-lime" />
                </div>
                <div className="bg-foreground text-card p-4">
                  <pre className="font-mono text-sm">
{`~/.claude/
└── commands/           # Global skills (all projects)
    ├── weather.md      → /weather
    ├── deploy.md       → /deploy
    └── git-commit.md   → /git-commit

your-project/
└── .claude/
    └── commands/       # Project-specific skills
        └── test.md     → /test`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Submitting Skills Section */}
        <section id="submitting" className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center bg-pop-lime border-4 border-foreground">
                <Upload className="h-6 w-6 text-foreground" />
              </div>
              <h2 className="text-3xl font-black uppercase text-foreground md:text-4xl">
                Submitting Skills
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Ready to share your skill with the community? There are two ways
                to submit skills to the registry.
              </p>

              {/* Option A */}
              <div className="border-4 border-foreground bg-card p-6 shadow-[4px_4px_0_0_var(--color-foreground)]">
                <h3 className="mb-4 text-xl font-black uppercase text-foreground">
                  Option A: File Upload
                </h3>
                <ol className="space-y-3 text-muted-foreground mb-6">
                  {[
                    <>Go to the <Link href="/submit" className="font-bold text-pop-pink underline">Submit page</Link></>,
                    "Drag and drop your skill folder (or select files)",
                    <>Include a <code className="border border-foreground bg-pop-yellow px-1 py-0.5 text-xs font-bold">SKILL.md</code> with proper frontmatter</>,
                    "Additional files (scripts, configs) are bundled with your submission",
                    "Submissions go through review before appearing in the directory",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-pop-cyan border-2 border-foreground text-sm font-black text-foreground">
                        {i + 1}
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ol>

                <Link
                  href="/submit"
                  className="inline-flex items-center gap-2 bg-pop-pink text-foreground border-3 border-foreground px-6 py-3 font-black uppercase shadow-[4px_4px_0_0_var(--color-foreground)] hover:shadow-[2px_2px_0_0_var(--color-foreground)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  Submit a Skill
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Option B */}
              <div className="border-4 border-foreground bg-card p-6 shadow-[4px_4px_0_0_var(--color-foreground)]">
                <div className="mb-4 flex items-center gap-3">
                  <h3 className="text-xl font-black uppercase text-foreground">
                    Option B: GitHub Link
                  </h3>
                  <span className="flex items-center gap-1 bg-pop-orange border-2 border-foreground px-2 py-1 text-xs font-bold uppercase text-foreground">
                    <Clock className="h-3 w-3" />
                    Coming Soon
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Soon you&apos;ll be able to link directly to a GitHub repository:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <Github className="mt-1 h-4 w-4 shrink-0 text-foreground" />
                    <span>Direct linking to your public GitHub repo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Github className="mt-1 h-4 w-4 shrink-0 text-foreground" />
                    <span>Automatic syncing when your repo updates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Github className="mt-1 h-4 w-4 shrink-0 text-foreground" />
                    <span>Version tracking tied to git tags</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SKILL.md Format Section */}
        <section
          id="skill-md"
          className="border-t-4 border-foreground bg-pop-cyan/20 px-6 py-16 md:py-24"
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center bg-pop-orange border-4 border-foreground">
                <FileText className="h-6 w-6 text-foreground" />
              </div>
              <h2 className="text-3xl font-black uppercase text-foreground md:text-4xl">
                SKILL.md Format
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Every skill requires a{" "}
                <code className="border border-foreground bg-pop-yellow px-2 py-0.5 text-sm font-bold">SKILL.md</code>{" "}
                file. This file uses YAML frontmatter for metadata and Markdown for documentation.
              </p>

              <h3 className="mt-8 text-xl font-black uppercase text-foreground">
                Required Fields
              </h3>
              <div className="border-4 border-foreground bg-card overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-foreground text-card">
                    <tr>
                      <th className="py-3 px-4 font-black uppercase">Field</th>
                      <th className="py-3 px-4 font-black uppercase">Type</th>
                      <th className="py-3 px-4 font-black uppercase">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-foreground">
                    <tr className="border-t-2 border-foreground">
                      <td className="py-3 px-4"><code className="bg-pop-yellow px-1 font-bold">name</code></td>
                      <td className="py-3 px-4">string</td>
                      <td className="py-3 px-4">Human-readable name of the skill</td>
                    </tr>
                    <tr className="border-t-2 border-foreground">
                      <td className="py-3 px-4"><code className="bg-pop-yellow px-1 font-bold">description</code></td>
                      <td className="py-3 px-4">string</td>
                      <td className="py-3 px-4">Brief description of what it does</td>
                    </tr>
                    <tr className="border-t-2 border-foreground">
                      <td className="py-3 px-4"><code className="bg-pop-yellow px-1 font-bold">version</code></td>
                      <td className="py-3 px-4">string</td>
                      <td className="py-3 px-4">Semantic version (e.g., &quot;1.0.0&quot;)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="mt-8 text-xl font-black uppercase text-foreground">
                Complete Example
              </h3>
              <div className="border-4 border-foreground shadow-[4px_4px_0_0_var(--color-foreground)]">
                <div className="bg-foreground px-3 py-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-pop-pink" />
                  <span className="w-3 h-3 bg-pop-yellow" />
                  <span className="w-3 h-3 bg-pop-lime" />
                  <span className="ml-3 text-xs text-card/50 font-bold">SKILL.md</span>
                </div>
                <div className="bg-foreground text-card p-4 overflow-x-auto">
                  <pre className="font-mono text-sm">
{`---
name: Weather API Skill
description: Fetch weather data from OpenWeatherMap API
version: 1.2.0
author: weatherapi
category: api
agents:
  - claude-code
  - cursor
  - codex
---

# Weather API Skill

This skill enables your AI agent to fetch weather data.

## Setup

1. Get an API key from OpenWeatherMap
2. Set the environment variable:
   export OPENWEATHER_API_KEY="your-api-key"

## Usage

Ask your agent:
- "What's the weather in Pittsburgh?"
- "Will it rain tomorrow in New York?"`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section id="best-practices" className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center bg-pop-yellow border-4 border-foreground">
                <Lightbulb className="h-6 w-6 text-foreground" />
              </div>
              <h2 className="text-3xl font-black uppercase text-foreground md:text-4xl">
                Best Practices
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Follow these guidelines to create skills that are useful,
                maintainable, and work well across different AI agents.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { title: "Stay Focused", desc: "Keep each skill focused on one capability. A skill that does one thing well is more reusable.", color: "bg-pop-pink" },
                  { title: "Clear Examples", desc: "Include usage examples in your SKILL.md. Show what prompts users can give.", color: "bg-pop-cyan" },
                  { title: "Document Dependencies", desc: "Clearly list any environment variables, API keys, or system dependencies required.", color: "bg-pop-lime" },
                  { title: "Test Across Agents", desc: "If possible, test your skill with multiple AI agents. Note any agent-specific quirks.", color: "bg-pop-orange" },
                  { title: "Handle Errors Gracefully", desc: "Provide helpful error messages when things go wrong. Guide users to the solution.", color: "bg-pop-yellow" },
                  { title: "Version Semantically", desc: "Use semantic versioning (MAJOR.MINOR.PATCH). Bump major for breaking changes.", color: "bg-pop-pink" },
                ].map((item) => (
                  <div key={item.title} className={`border-4 border-foreground ${item.color} p-6 shadow-[4px_4px_0_0_var(--color-foreground)]`}>
                    <h3 className="mb-3 flex items-center gap-2 font-black uppercase text-foreground">
                      <Check className="h-5 w-5" />
                      {item.title}
                    </h3>
                    <p className="text-sm text-foreground/80">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-4 border-foreground bg-pop-lime p-6 shadow-[4px_4px_0_0_var(--color-foreground)]">
                <h3 className="mb-3 text-xl font-black uppercase text-foreground">
                  Ready to create your first skill?
                </h3>
                <p className="mb-4 text-foreground/80">
                  Browse existing skills for inspiration, then submit your own to share with the community.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/skills"
                    className="inline-flex items-center gap-2 bg-foreground text-card border-3 border-foreground px-6 py-3 font-black uppercase hover:bg-foreground/90 transition-all"
                  >
                    Browse Skills
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/submit"
                    className="inline-flex items-center gap-2 bg-card text-foreground border-3 border-foreground px-6 py-3 font-black uppercase shadow-[4px_4px_0_0_var(--color-foreground)] hover:shadow-[2px_2px_0_0_var(--color-foreground)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    Submit a Skill
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

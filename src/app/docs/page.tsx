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
        {/* Hero Section */}
        <section className="border-b border-border px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 bg-foreground rounded-md px-4 py-2">
              <BookOpen className="h-5 w-5 text-white" />
              <span className="font-serif text-lg font-bold text-white">
                Documentation
              </span>
            </div>
            <h1 className="mb-6 font-serif text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
              Learn to use <span className="text-muted-foreground">Skills</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Everything you need to know about finding, installing, creating,
              and sharing skills for your AI coding agents.
            </p>
          </div>
        </section>

        {/* Quick Nav */}
        <section className="border-b border-border section-alt px-6 py-8">
          <div className="mx-auto max-w-4xl">
            <nav className="flex flex-wrap justify-center gap-4">
              <a
                href="#what-are-skills"
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-[--teal] transition-colors"
              >
                <Puzzle className="h-4 w-4" />
                What Are Skills?
              </a>
              <a
                href="#installing"
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-[--teal] transition-colors"
              >
                <Download className="h-4 w-4" />
                Installing
              </a>
              <a
                href="#submitting"
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-[--teal] transition-colors"
              >
                <Upload className="h-4 w-4" />
                Submitting
              </a>
              <a
                href="#skill-md"
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-[--teal] transition-colors"
              >
                <FileText className="h-4 w-4" />
                SKILL.md Format
              </a>
              <a
                href="#best-practices"
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-[--teal] transition-colors"
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
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-[--teal] rounded-lg">
                <Puzzle className="h-6 w-6 text-white" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                What Are Skills?
              </h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Skills are <strong>reusable capabilities</strong> for AI coding
                agents. Unlike static documentation or simple prompts, skills
                provide{" "}
                <em>procedural knowledge</em>—they teach your AI assistant{" "}
                <strong>how to do things</strong>, not just facts about things.
              </p>

              <div className="my-8 rounded-lg bg-card p-6">
                <h3 className="mb-4 font-serif text-xl font-bold text-foreground">
                  Think of skills like plugins for your AI
                </h3>
                <p className="text-muted-foreground">
                  Just as browser extensions add new features to Chrome, skills
                  add new capabilities to AI agents. They come with
                  instructions, scripts, and configurations that enable your
                  agent to interact with external services and automate complex
                  workflows.
                </p>
              </div>

              <h3 className="mb-4 mt-8 font-serif text-xl font-bold text-foreground">
                Example Skills
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center bg-[--teal] rounded">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span>
                    <strong>GitHub integration</strong> — Create issues, open
                    PRs, manage repositories
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center bg-[--teal] rounded">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span>
                    <strong>Weather APIs</strong> — Fetch forecasts and
                    conditions from any location
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center bg-[--teal] rounded">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span>
                    <strong>Database management</strong> — Query, backup, and
                    migrate databases
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center bg-[--teal] rounded">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span>
                    <strong>Deployment automation</strong> — Deploy to Vercel,
                    AWS, Railway, and more
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center bg-[--teal] rounded">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span>
                    <strong>Notification services</strong> — Send Slack
                    messages, emails, or SMS alerts
                  </span>
                </li>
              </ul>

              <h3 className="mb-4 mt-8 font-serif text-xl font-bold text-foreground">
                Cross-Agent Compatibility
              </h3>
              <p className="text-muted-foreground">
                Skills are designed to work across multiple AI coding agents:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Claude Code",
                  "Cursor",
                  "Codex",
                  "Clawdbot",
                  "Windsurf",
                  "Aider",
                  "GitHub Copilot",
                ].map((agent) => (
                  <span
                    key={agent}
                    className="border border-border bg-background px-3 py-1 text-sm font-medium text-foreground"
                  >
                    {agent}
                  </span>
                ))}
              </div>

              <h3 className="mb-4 mt-8 font-serif text-xl font-bold text-foreground">
                Anatomy of a Skill
              </h3>
              <p className="mb-4 text-muted-foreground">
                At minimum, every skill contains a <code>SKILL.md</code> file.
                More complex skills include additional scripts and
                configurations:
              </p>
              <div className="terminal">
                <div className="terminal-header">
                  <span className="terminal-dot terminal-dot-red" />
                  <span className="terminal-dot terminal-dot-yellow" />
                  <span className="terminal-dot terminal-dot-green" />
                </div>
                <div className="terminal-content">
                  <pre className="text-white/90">
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
          className="border-t border-border section-alt px-6 py-16 md:py-24"
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-[--teal] rounded-lg">
                <Download className="h-6 w-6 text-white" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                Installing Skills
              </h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Installing skills is simple with the{" "}
                <code className="bg-muted px-2 py-0.5">skills</code>{" "}
                CLI. You don&apos;t even need to install it globally—just use{" "}
                <code className="bg-muted px-2 py-0.5">npx</code>.
              </p>

              <h3 className="mb-4 mt-8 font-serif text-xl font-bold text-foreground">
                Basic Installation
              </h3>
              <div className="terminal">
                <div className="terminal-header">
                  <span className="terminal-dot terminal-dot-red" />
                  <span className="terminal-dot terminal-dot-yellow" />
                  <span className="terminal-dot terminal-dot-green" />
                </div>
                <div className="terminal-content">
                  <div className="space-y-1">
                    <p className="text-white/60">
                      $ npx skills add owner/skill-name
                    </p>
                    <p className="text-white/60">
                      Fetching skill from registry...
                    </p>
                    <p className="text-white/60">
                      Installing to ./skills/skill-name/
                    </p>
                    <p className="text-[#27c93f]">✓ Skill installed successfully!</p>
                  </div>
                </div>
              </div>

              <h3 className="mb-4 mt-8 font-serif text-xl font-bold text-foreground">
                How It Works
              </h3>
              <ol className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[--teal] rounded text-sm font-bold text-white">
                    1
                  </span>
                  <span>
                    <strong>npx downloads the skills CLI</strong> — You
                    don&apos;t need to install anything globally. npx fetches
                    the latest version of the skills CLI from npm automatically.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[--teal] rounded text-sm font-bold text-white">
                    2
                  </span>
                  <span>
                    <strong>The CLI queries the registry</strong> — It connects
                    to skills.sh to find the requested skill and download its
                    files.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[--teal] rounded text-sm font-bold text-white">
                    3
                  </span>
                  <span>
                    <strong>Files are installed locally</strong> — The skill
                    files are placed in your project&apos;s{" "}
                    <code className="bg-muted px-2 py-0.5">skills/</code>{" "}
                    directory (or wherever your agent looks for skills).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[--teal] rounded text-sm font-bold text-white">
                    4
                  </span>
                  <span>
                    <strong>Your agent discovers the skill</strong> — Next time
                    your AI agent runs, it will automatically pick up the new
                    capability.
                  </span>
                </li>
              </ol>

              <h3 className="mb-4 mt-8 font-serif text-xl font-bold text-foreground">
                Other Commands
              </h3>
              <div className="terminal">
                <div className="terminal-header">
                  <span className="terminal-dot terminal-dot-red" />
                  <span className="terminal-dot terminal-dot-yellow" />
                  <span className="terminal-dot terminal-dot-green" />
                </div>
                <div className="terminal-content space-y-3">
                  <p className="text-white/60">
                    <span className="text-white"># List installed skills</span>
                  </p>
                  <p className="text-white/80">$ npx skills list</p>
                  <p className="mt-3 text-white/60">
                    <span className="text-white"># Remove a skill</span>
                  </p>
                  <p className="text-white/80">$ npx skills remove skill-name</p>
                  <p className="mt-3 text-white/60">
                    <span className="text-white"># Update all skills</span>
                  </p>
                  <p className="text-white/80">$ npx skills update</p>
                </div>
              </div>

              <div className="mt-8 rounded-lg bg-card p-6">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                  <Terminal className="h-5 w-5" />
                  The skills.sh Ecosystem
                </h4>
                <p className="text-muted-foreground">
                  The skills CLI connects to{" "}
                  <strong>skills.sh</strong>—the central registry for AI agent
                  skills. When you publish a skill, it becomes available to
                  anyone using the CLI. The registry handles versioning,
                  discovery, and distribution.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Submitting Skills Section */}
        <section id="submitting" className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-[--teal] rounded-lg">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                Submitting Skills
              </h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Ready to share your skill with the community? There are two ways
                to submit skills to the registry.
              </p>

              {/* Option A */}
              <div className="mt-8 rounded-lg bg-card p-6">
                <h3 className="mb-4 font-serif text-xl font-bold text-foreground">
                  Option A: File Upload
                </h3>
                <ol className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[--teal] rounded text-sm font-bold text-white">
                      1
                    </span>
                    <span>
                      Go to the{" "}
                      <Link
                        href="/submit"
                        className="font-semibold text-foreground underline underline-offset-4"
                      >
                        Submit page
                      </Link>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[--teal] rounded text-sm font-bold text-white">
                      2
                    </span>
                    <span>
                      Drag and drop your skill folder (or select files)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[--teal] rounded text-sm font-bold text-white">
                      3
                    </span>
                    <span>
                      Make sure you include a{" "}
                      <code className="bg-muted px-2 py-0.5">
                        SKILL.md
                      </code>{" "}
                      with proper frontmatter (see format below)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[--teal] rounded text-sm font-bold text-white">
                      4
                    </span>
                    <span>
                      Additional files (scripts, configs) are bundled with your
                      submission
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[--teal] rounded text-sm font-bold text-white">
                      5
                    </span>
                    <span>
                      Submissions go through review before appearing in the
                      directory
                    </span>
                  </li>
                </ol>

                <div className="mt-6">
                  <Link
                    href="/submit"
                    className="inline-flex items-center gap-2 bg-[--teal] rounded-md px-6 py-3 font-medium text-white hover:bg-[--teal]/90 transition-colors"
                  >
                    Submit a Skill
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Option B */}
              <div className="mt-6 rounded-lg bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <h3 className="font-serif text-xl font-bold text-foreground">
                    Option B: GitHub Link
                  </h3>
                  <span className="flex items-center gap-1 bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Coming Soon
                  </span>
                </div>
                <p className="text-muted-foreground">
                  Soon you&apos;ll be able to link directly to a GitHub
                  repository containing your skill. This will enable:
                </p>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <Github className="mt-1 h-4 w-4 shrink-0" />
                    <span>
                      Direct linking to your public GitHub repo
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Github className="mt-1 h-4 w-4 shrink-0" />
                    <span>
                      Automatic syncing when your repo updates
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Github className="mt-1 h-4 w-4 shrink-0" />
                    <span>
                      Version tracking tied to git tags
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SKILL.md Format Section */}
        <section
          id="skill-md"
          className="border-t border-border section-alt px-6 py-16 md:py-24"
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-[--teal] rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                SKILL.md Format
              </h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Every skill requires a{" "}
                <code className="bg-muted px-2 py-0.5">SKILL.md</code>{" "}
                file. This file uses YAML frontmatter for metadata and Markdown
                for documentation.
              </p>

              <h3 className="mb-4 mt-8 font-serif text-xl font-bold text-foreground">
                Required Fields
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 pr-4 font-semibold text-foreground">
                        Field
                      </th>
                      <th className="py-3 pr-4 font-semibold text-foreground">
                        Type
                      </th>
                      <th className="py-3 font-semibold text-foreground">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border">
                      <td className="py-3 pr-4">
                        <code className="bg-muted px-2 py-0.5">
                          name
                        </code>
                      </td>
                      <td className="py-3 pr-4">string</td>
                      <td className="py-3">
                        Human-readable name of the skill
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 pr-4">
                        <code className="bg-muted px-2 py-0.5">
                          description
                        </code>
                      </td>
                      <td className="py-3 pr-4">string</td>
                      <td className="py-3">Brief description of what it does</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 pr-4">
                        <code className="bg-muted px-2 py-0.5">
                          version
                        </code>
                      </td>
                      <td className="py-3 pr-4">string</td>
                      <td className="py-3">
                        Semantic version (e.g., &quot;1.0.0&quot;)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="mb-4 mt-8 font-serif text-xl font-bold text-foreground">
                Optional Fields
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 pr-4 font-semibold text-foreground">
                        Field
                      </th>
                      <th className="py-3 pr-4 font-semibold text-foreground">
                        Type
                      </th>
                      <th className="py-3 font-semibold text-foreground">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border">
                      <td className="py-3 pr-4">
                        <code className="bg-muted px-2 py-0.5">
                          author
                        </code>
                      </td>
                      <td className="py-3 pr-4">string</td>
                      <td className="py-3">Author name or organization</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 pr-4">
                        <code className="bg-muted px-2 py-0.5">
                          agents
                        </code>
                      </td>
                      <td className="py-3 pr-4">string[]</td>
                      <td className="py-3">
                        List of compatible agents
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 pr-4">
                        <code className="bg-muted px-2 py-0.5">
                          category
                        </code>
                      </td>
                      <td className="py-3 pr-4">string</td>
                      <td className="py-3">
                        Category for organization (e.g., &quot;api&quot;, &quot;database&quot;)
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 pr-4">
                        <code className="bg-muted px-2 py-0.5">
                          homepage
                        </code>
                      </td>
                      <td className="py-3 pr-4">string</td>
                      <td className="py-3">URL to project homepage or repo</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 pr-4">
                        <code className="bg-muted px-2 py-0.5">
                          license
                        </code>
                      </td>
                      <td className="py-3 pr-4">string</td>
                      <td className="py-3">SPDX license identifier</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 pr-4">
                        <code className="bg-muted px-2 py-0.5">
                          tags
                        </code>
                      </td>
                      <td className="py-3 pr-4">string[]</td>
                      <td className="py-3">Keywords for searchability</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="mb-4 mt-8 font-serif text-xl font-bold text-foreground">
                Complete Example
              </h3>
              <div className="terminal">
                <div className="terminal-header">
                  <span className="terminal-dot terminal-dot-red" />
                  <span className="terminal-dot terminal-dot-yellow" />
                  <span className="terminal-dot terminal-dot-green" />
                  <span className="ml-3 text-xs text-white/50">SKILL.md</span>
                </div>
                <div className="terminal-content">
                  <pre className="overflow-x-auto text-white/90">
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
homepage: https://github.com/weatherapi/weather-skill
license: MIT
tags:
  - weather
  - api
  - openweathermap
---

# Weather API Skill

This skill enables your AI agent to fetch weather data from
the OpenWeatherMap API.

## Setup

1. Get an API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Set the environment variable:
   \`\`\`bash
   export OPENWEATHER_API_KEY="your-api-key"
   \`\`\`

## Usage

Ask your agent:
- "What's the weather in Pittsburgh?"
- "Will it rain tomorrow in New York?"
- "Get the 5-day forecast for London"

## Capabilities

- Current weather conditions
- 5-day forecasts
- Temperature, humidity, wind speed
- Weather alerts`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section id="best-practices" className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-[--teal] rounded-lg">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                Best Practices
              </h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Follow these guidelines to create skills that are useful,
                maintainable, and work well across different AI agents.
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-card p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                    <Check className="h-5 w-5 text-[--teal]" />
                    Stay Focused
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Keep each skill focused on <strong>one capability</strong>.
                    A skill that does one thing well is more reusable than a
                    kitchen-sink approach. If you need multiple capabilities,
                    create multiple skills.
                  </p>
                </div>

                <div className="rounded-lg bg-card p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                    <Check className="h-5 w-5 text-[--teal]" />
                    Clear Examples
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Include <strong>usage examples</strong> in your SKILL.md.
                    Show what prompts users can give to their agent and what
                    responses to expect. Real examples help agents understand
                    context.
                  </p>
                </div>

                <div className="rounded-lg bg-card p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                    <Check className="h-5 w-5 text-[--teal]" />
                    Document Dependencies
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Clearly list any{" "}
                    <strong>environment variables, API keys, or system
                    dependencies</strong>{" "}
                    required. Nothing is more frustrating than a skill that
                    fails silently due to missing config.
                  </p>
                </div>

                <div className="rounded-lg bg-card p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                    <Check className="h-5 w-5 text-[--teal]" />
                    Test Across Agents
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    If possible, test your skill with{" "}
                    <strong>multiple AI agents</strong>. What works in Claude
                    Code might need tweaks for Cursor or Codex. Note any
                    agent-specific quirks in your docs.
                  </p>
                </div>

                <div className="rounded-lg bg-card p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                    <Check className="h-5 w-5 text-[--teal]" />
                    Handle Errors Gracefully
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your skill should provide{" "}
                    <strong>helpful error messages</strong> when things go
                    wrong. &quot;API key invalid&quot; is better than a cryptic stack
                    trace. Guide users to the solution.
                  </p>
                </div>

                <div className="rounded-lg bg-card p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                    <Check className="h-5 w-5 text-[--teal]" />
                    Version Semantically
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Use <strong>semantic versioning</strong> (MAJOR.MINOR.PATCH).
                    Bump major for breaking changes, minor for new features,
                    patch for bug fixes. This helps users know what to expect
                    from updates.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-lg bg-[--teal]/10 border border-[--teal]/20 p-6">
                <h3 className="mb-3 font-serif text-xl font-bold text-foreground">
                  Ready to create your first skill?
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Browse existing skills for inspiration, then submit your own
                  to share with the community.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/skills"
                    className="inline-flex items-center gap-2 bg-[--teal] rounded-md px-6 py-3 font-medium text-white hover:bg-[--teal]/90 transition-colors"
                  >
                    Browse Skills
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/submit"
                    className="inline-flex items-center gap-2 border border-foreground rounded-md px-6 py-3 font-medium text-foreground hover:bg-foreground hover:text-white transition-colors"
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

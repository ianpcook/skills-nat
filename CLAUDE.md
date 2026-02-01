# Skills N'at

A Pittsburgh-born marketplace for discovering, sharing, and installing AI agent skills for Claude Code, Cursor, Codex, and more.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL with Drizzle ORM
- **Auth:** better-auth
- **Styling:** Tailwind CSS 4 + shadcn/ui components
- **Fonts:** Space Grotesk (sans), JetBrains Mono (mono)

## Design Context

### Users

Developers with a specific need, looking to quickly find and install AI agent skills. They arrive with intent—searching for a particular capability, evaluating options, and copying install commands. Speed and clarity matter. They want to discover relevant skills, verify compatibility with their agent (Claude Code, Cursor, etc.), and get the install command without friction.

### Brand Personality

**Bold, Local, Playful**

- **Bold:** Inspired by Andy Warhol's pop art heritage—saturated colors, thick borders, graphic shapes, confident typography. Nothing subtle.
- **Local:** Proudly Pittsburgh. Bridge iconography, neighborhood references (Squirrel Hill, Polish Hill, Oakland), Pittsburghese ("n'at", "yinz"). Steel City authenticity.
- **Playful:** Fun without being juvenile. The interface should spark curiosity and delight—unexpected color combinations, chunky shadows, animated interactions.

### Aesthetic Direction

**Warhol Pop Art meets Developer Tools**

- Warm cream background (`oklch(0.97 0.01 90)`) for vintage poster feel
- Bold primary palette: Pittsburgh Gold, Hot Pink, Cyan, Lime, Orange
- Heavy black borders (3-4px), chunky drop shadows
- Sharp corners (`--radius: 0rem`) for graphic, poster-like appearance
- Space Grotesk for confident, geometric headlines
- Terminal-style code blocks with yellow `$` prompts
- Halftone dot patterns as subtle texture

**References:**
- Warhol's screen prints (color blocking, repetition, saturation)
- Pittsburgh's industrial heritage (bridges, steel, rivers)
- Vintage concert posters and zine aesthetics

**Anti-references:**
- Apple/minimal SaaS aesthetic (too polished, sterile, corporate)
- Generic tech startup look (interchangeable, forgettable)
- Bootstrap/Material defaults (bland, expected)

### Design Principles

1. **Loud is Good** — Every element should have presence. If it doesn't demand attention, make it bolder or remove it.

2. **Pittsburgh First** — Local flavor isn't decoration, it's identity. Bridge icons, neighborhood names, and Pittsburghese should feel natural, not forced.

3. **Developer-Respectful Speed** — Devs are here to install skills, not admire design. Make install commands prominent, copy buttons obvious, compatibility clear at a glance.

4. **Playful Utility** — Fun interactions (shadow shifts, color pops, copy confirmations) that enhance rather than obstruct the task.

5. **Accessibility Through Contrast** — The bold color palette naturally provides strong contrast. Maintain semantic HTML, keyboard navigation, and screen reader support.

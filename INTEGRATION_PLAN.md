# Skills N'at Integration Plan

**Goal:** Replace the old frontend in `skills-nat` with the new v0 frontend while preserving the backend.

**Date:** January 24, 2026  
**Status:** 📋 Planning Phase

---

## 📊 Analysis Summary

### Repository Overview

| Aspect | skills-nat (Current) | v0-skills-nat (New) |
|--------|------------------------|------------------------|
| **Frontend** | Custom dark theme | shadcn/ui light golden theme |
| **Backend** | ✅ Postgres + Drizzle + better-auth | ❌ None |
| **Data Source** | Static JSON + Database | Hardcoded in components |
| **Pages** | Home, Skills, Submit, Admin | Home only |
| **Components** | 4 custom components | 13 shadcn/ui components |

### Files Inventory

#### skills-nat - Backend (KEEP)
```
src/
├── app/api/
│   ├── submit/route.ts          # POST - file upload submission
│   ├── skills/route.ts          # GET - list approved skills
│   ├── auth/[...all]/route.ts   # better-auth routes
│   └── admin/submissions/
│       ├── route.ts             # GET - list submissions
│       └── [id]/route.ts        # GET, PATCH - manage submission
├── db/
│   ├── index.ts                 # Drizzle connection
│   └── schema.ts                # Database schema
├── lib/
│   ├── auth.ts                  # better-auth server config
│   └── auth-client.ts           # better-auth client hooks
├── data/skills.json             # Static skill data (reference)
└── types/index.ts               # TypeScript types
```

#### skills-nat - Frontend (REPLACE)
```
src/
├── app/
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Dark theme styles
│   ├── not-found.tsx            # 404 page
│   ├── skills/
│   │   ├── page.tsx             # Skills directory
│   │   └── [slug]/page.tsx      # Skill detail page
│   ├── submit/page.tsx          # Submission form
│   └── admin/
│       ├── page.tsx             # Admin login
│       └── submissions/
│           ├── page.tsx         # Submissions list
│           ├── layout.tsx       # Admin layout
│           └── [id]/page.tsx    # Submission detail
└── components/
    ├── SkillCard.tsx
    ├── AgentBadge.tsx
    ├── Navigation.tsx
    └── Footer.tsx
```

#### v0-skills-nat - Frontend (ADOPT)
```
app/
├── page.tsx                     # New homepage
├── layout.tsx                   # New root layout
└── globals.css                  # Light golden theme

components/
├── ui/
│   ├── badge.tsx                # shadcn badge
│   └── button.tsx               # shadcn button
├── header.tsx                   # Navigation header
├── hero-section.tsx             # Landing hero
├── agents-list.tsx              # Supported agents
├── what-are-skills.tsx          # Explainer section
├── featured-skills.tsx          # Featured skills grid (HARDCODED)
├── recently-updated.tsx         # Recent skills grid (HARDCODED)
├── skill-card.tsx               # Skill display card
├── cta-section.tsx              # Call to action
├── footer.tsx                   # Site footer
├── theme-provider.tsx           # Theme context
└── sprocket.tsx                 # Decorative element
```

---

## 🔌 API Documentation

### 1. POST /api/submit
**Purpose:** Submit a new skill for review

**Request:**
- Content-Type: `multipart/form-data`
- Body: Files (must include `SKILL.md`)

**SKILL.md Frontmatter:**
```yaml
---
name: My Skill Name
description: Brief description
version: 1.0.0
---
```

**Response (200):**
```json
{
  "success": true,
  "id": "uuid",
  "message": "Submission received and pending review"
}
```

**Errors:** 400 (missing SKILL.md), 500 (server error)

---

### 2. GET /api/skills
**Purpose:** List approved skills (public)

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Items per page (max 100) |
| search | string | - | Search name/description/slug |
| category | string | - | Filter by category |

**Response:**
```json
{
  "skills": [
    {
      "id": "uuid",
      "slug": "skill-name",
      "name": "Skill Name",
      "version": "1.0.0",
      "description": "Full description",
      "shortDescription": "Brief",
      "author": "username",
      "category": "Developer Tools",
      "stars": 100,
      "agents": ["claude-code", "cursor"],
      "files": [...],
      "approvedAt": "2025-01-24T00:00:00Z",
      "createdAt": "2025-01-24T00:00:00Z",
      "updatedAt": "2025-01-24T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3,
    "hasMore": true
  }
}
```

---

### 3. GET /api/admin/submissions
**Purpose:** List all submissions (admin only)
**Auth:** Requires session cookie

**Query:** `?status=pending|approved|rejected`

**Response:**
```json
{
  "submissions": [...],
  "total": 10
}
```

---

### 4. GET /api/admin/submissions/[id]
**Purpose:** Get single submission details
**Auth:** Requires session cookie

**Response:**
```json
{
  "submission": {
    "id": "uuid",
    "slug": "skill-name",
    "name": "Skill Name",
    "version": "1.0.0",
    "description": "...",
    "files": [
      { "name": "SKILL.md", "content": "...", "size": 1234 }
    ],
    "status": "pending",
    "reviewerNotes": null,
    "submittedAt": "...",
    "reviewedAt": null
  }
}
```

---

### 5. PATCH /api/admin/submissions/[id]
**Purpose:** Approve or reject submission
**Auth:** Requires session cookie

**Request:**
```json
{
  "status": "approved" | "rejected",
  "reviewerNotes": "Optional notes"
}
```

**Side Effect:** If `approved`, creates entry in `skills` table.

---

## ⚠️ Gaps & Mismatches

### 1. Data Format Differences

**v0 Skill Interface:**
```typescript
interface Skill {
  name: string;
  author: string;
  description: string;
  stars: number;
  agents: string[];      // Agent NAMES (e.g., "Claude Code")
  category: string;
  version: string;
  featured?: boolean;
}
```

**Backend Skill Schema:**
```typescript
interface Skill {
  id: string;
  slug: string;
  name: string;
  version: string;
  description: string | null;
  shortDescription: string | null;
  files: SubmissionFile[];
  author: string | null;
  category: string | null;
  stars: number;
  agents: string[];      // Agent IDs (e.g., "claude-code")
  submissionId: string | null;
  approvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

**Resolution:** Update v0 `SkillCard` to handle backend format, add agent ID→name mapping.

---

### 2. Missing Pages in v0

| Page | Status | Action Needed |
|------|--------|---------------|
| `/skills` | ❌ Missing | Create - Skills directory with filters |
| `/skills/[slug]` | ❌ Missing | Create - Skill detail page |
| `/submit` | ❌ Missing | Port from old frontend |
| `/admin` | ❌ Missing | Port from old frontend |
| `/admin/submissions` | ❌ Missing | Port from old frontend |
| `/admin/submissions/[id]` | ❌ Missing | Port from old frontend |
| `/search` | ❌ Missing | Redirect to /skills?search= |
| `/faves` | ❌ Missing | Future feature (can stub) |
| `/docs` | ❌ Missing | Future feature (can stub) |

---

### 3. Hardcoded Data in v0

**Affected Files:**
- `featured-skills.tsx` - Array of 4 hardcoded skills
- `recently-updated.tsx` - Array of 4 hardcoded skills
- `agents-list.tsx` - Hardcoded agent list

**Resolution:** 
- Create data fetching hooks
- Use `GET /api/skills` with `?limit=4` for featured/recent
- Move agents to `lib/constants.ts`

---

### 4. Theme/Color Differences

| Element | Old (Dark) | New (Light) |
|---------|------------|-------------|
| Background | `#1a160d` | `#E9A319` (gold) |
| Cards | `#1d1e1f` | `#FFFFFF` |
| Text | `#f5f0e6` | `#0D0D0D` |
| Accent | `#ffbc20` | `#0D0D0D` |

**Resolution:** Use v0's light theme. Update admin pages to match.

---

### 5. Dependencies to Reconcile

**Add to skills-nat (from v0):**
```json
{
  "@radix-ui/react-slot": "^1.1.1",
  "@vercel/analytics": "1.3.1",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "lucide-react": "^0.454.0",
  "tailwind-merge": "^3.3.1",
  "tailwindcss-animate": "^1.0.7",
  "tw-animate-css": "1.3.3"
}
```

**Keep existing:**
```json
{
  "better-auth": "^1.4.17",
  "drizzle-orm": "^0.45.1",
  "pg": "^8.17.2",
  "dotenv": "^17.2.3"
}
```

---

## 📝 Integration Steps

### Phase 1: Preparation

#### Step 1.1: Backup
```bash
cd ~/repos/skills-nat
git checkout -b backup/pre-integration
git push origin backup/pre-integration
git checkout main
git checkout -b feature/v0-frontend-integration
```

#### Step 1.2: Install New Dependencies
```bash
pnpm add @radix-ui/react-slot @vercel/analytics class-variance-authority clsx lucide-react tailwind-merge tailwindcss-animate
pnpm add -D tw-animate-css
```

#### Step 1.3: Create Utility Functions
Create `src/lib/utils.ts`:
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

### Phase 2: Copy v0 Components

#### Step 2.1: Copy UI Components
```bash
# From v0-skills-nat, copy to skills-nat/src/components/
cp -r ~/repos/v0-skills-nat/components/ui ~/repos/skills-nat/src/components/
```

#### Step 2.2: Copy Page Components
```bash
cp ~/repos/v0-skills-nat/components/header.tsx ~/repos/skills-nat/src/components/
cp ~/repos/v0-skills-nat/components/footer.tsx ~/repos/skills-nat/src/components/
cp ~/repos/v0-skills-nat/components/hero-section.tsx ~/repos/skills-nat/src/components/
cp ~/repos/v0-skills-nat/components/agents-list.tsx ~/repos/skills-nat/src/components/
cp ~/repos/v0-skills-nat/components/what-are-skills.tsx ~/repos/skills-nat/src/components/
cp ~/repos/v0-skills-nat/components/featured-skills.tsx ~/repos/skills-nat/src/components/
cp ~/repos/v0-skills-nat/components/recently-updated.tsx ~/repos/skills-nat/src/components/
cp ~/repos/v0-skills-nat/components/skill-card.tsx ~/repos/skills-nat/src/components/
cp ~/repos/v0-skills-nat/components/cta-section.tsx ~/repos/skills-nat/src/components/
cp ~/repos/v0-skills-nat/components/theme-provider.tsx ~/repos/skills-nat/src/components/
cp ~/repos/v0-skills-nat/components/sprocket.tsx ~/repos/skills-nat/src/components/
```

#### Step 2.3: Update Import Paths
All copied components use `@/components/` imports. Update to match skills-nat structure.

---

### Phase 3: Replace Styles

#### Step 3.1: Replace globals.css
```bash
cp ~/repos/v0-skills-nat/app/globals.css ~/repos/skills-nat/src/app/globals.css
```

#### Step 3.2: Copy Public Assets
```bash
cp -r ~/repos/v0-skills-nat/public/* ~/repos/skills-nat/public/
```

---

### Phase 4: Update Homepage

#### Step 4.1: Replace src/app/page.tsx
Use v0's page structure but integrate with backend.

**New page.tsx:**
```typescript
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { AgentsList } from "@/components/agents-list";
import { WhatAreSkills } from "@/components/what-are-skills";
import { FeaturedSkills } from "@/components/featured-skills";
import { RecentlyUpdated } from "@/components/recently-updated";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <AgentsList />
        <WhatAreSkills />
        <FeaturedSkills />
        <RecentlyUpdated />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
```

#### Step 4.2: Update layout.tsx
```bash
# Use v0's layout with fonts
cp ~/repos/v0-skills-nat/app/layout.tsx ~/repos/skills-nat/src/app/layout.tsx
# Then manually add back any Next.js config from original
```

---

### Phase 5: Wire Up Data Fetching

#### Step 5.1: Create Data Fetching Utilities
Create `src/lib/api.ts`:
```typescript
import { Skill } from "@/db/schema";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function getFeaturedSkills(): Promise<Skill[]> {
  const res = await fetch(`${API_BASE}/api/skills?limit=4`, {
    next: { revalidate: 300 } // Cache for 5 min
  });
  const data = await res.json();
  return data.skills || [];
}

export async function getRecentSkills(): Promise<Skill[]> {
  const res = await fetch(`${API_BASE}/api/skills?limit=4`, {
    next: { revalidate: 60 } // Cache for 1 min
  });
  const data = await res.json();
  return data.skills || [];
}

export async function getAllSkills(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.category) searchParams.set('category', params.category);
  
  const res = await fetch(`${API_BASE}/api/skills?${searchParams}`);
  return res.json();
}
```

#### Step 5.2: Create Agent Mapping
Create `src/lib/constants.ts`:
```typescript
export const AGENTS = [
  { id: "claude-code", name: "Claude Code", color: "#0D0D0D" },
  { id: "cursor", name: "Cursor", color: "#D4940F" },
  { id: "codex", name: "Codex", color: "#0D0D0D" },
  { id: "clawdbot", name: "Clawdbot", color: "#D4940F" },
  { id: "antigravity", name: "Antigravity", color: "#0D0D0D" },
  { id: "gemini", name: "Gemini", color: "#D4940F" },
] as const;

export function getAgentName(id: string): string {
  return AGENTS.find(a => a.id === id)?.name || id;
}

export function getAgentColor(id: string): string {
  return AGENTS.find(a => a.id === id)?.color || "#0D0D0D";
}
```

#### Step 5.3: Update featured-skills.tsx
Convert from hardcoded to server component with data fetching:
```typescript
import { getFeaturedSkills } from "@/lib/api";
import { SkillCard } from "@/components/skill-card";

export async function FeaturedSkills() {
  const skills = await getFeaturedSkills();
  
  // ... rest of component using dynamic data
}
```

#### Step 5.4: Update skill-card.tsx
Update interface to match backend schema:
```typescript
import { type Skill } from "@/db/schema";
import { getAgentName, getAgentColor } from "@/lib/constants";

export function SkillCard({ skill }: { skill: Skill }) {
  const agents = skill.agents.map(id => ({
    id,
    name: getAgentName(id),
    color: getAgentColor(id)
  }));
  
  // ... render with mapped agents
}
```

---

### Phase 6: Create Missing Pages

#### Step 6.1: Create /skills Page
Create `src/app/skills/page.tsx` - combine v0 styling with old functionality:
- Use v0's card design
- Port filter/search logic from old skills page
- Fetch from `/api/skills`

#### Step 6.2: Create /skills/[slug] Page
Create `src/app/skills/[slug]/page.tsx`:
- Requires NEW API endpoint: `GET /api/skills/[slug]`
- Port detail layout from old frontend with v0 styling

#### Step 6.3: Port /submit Page
Copy and restyle `src/app/submit/page.tsx`:
- Keep all form logic (it already works!)
- Update styling to match v0 theme
- Update imports for new components

#### Step 6.4: Port Admin Pages
These need the least styling changes (internal tools):
1. Copy `src/app/admin/page.tsx` (login)
2. Copy `src/app/admin/submissions/layout.tsx`
3. Copy `src/app/admin/submissions/page.tsx`
4. Copy `src/app/admin/submissions/[id]/page.tsx`
5. Update imports and adjust colors to be cohesive

---

### Phase 7: Add Missing API Endpoint

#### Step 7.1: Create GET /api/skills/[slug]
Create `src/app/api/skills/[slug]/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db, skills } from '@/db';
import { eq, sql } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  const [skill] = await db
    .select()
    .from(skills)
    .where(eq(skills.slug, slug))
    .limit(1);
    
  if (!skill || !skill.approvedAt) {
    return NextResponse.json(
      { error: 'Skill not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ skill });
}
```

---

### Phase 8: Header Navigation Updates

#### Step 8.1: Update header.tsx Links
```typescript
// Update navigation links
<nav>
  <Link href="/">Home</Link>
  <Link href="/skills">Browse</Link>
  <Link href="/submit">Submit</Link>
</nav>
```

#### Step 8.2: Remove Non-existent Links
- Remove `/search` → redirect to `/skills?search=`
- Remove `/faves` → stub or remove link
- Update `/docs` → link to GitHub README or remove

---

### Phase 9: Delete Old Files

#### Step 9.1: Remove Old Components
```bash
rm -rf src/components/SkillCard.tsx
rm -rf src/components/AgentBadge.tsx
rm -rf src/components/Navigation.tsx
rm -rf src/components/Footer.tsx
```

Note: Keep `src/data/skills.json` for reference/seeding.

---

### Phase 10: Testing Checklist

- [ ] Homepage loads with real data from API
- [ ] Featured skills section shows database skills
- [ ] Recently updated section shows database skills
- [ ] `/skills` page lists all approved skills
- [ ] `/skills` search works
- [ ] `/skills` category filter works
- [ ] `/skills/[slug]` shows skill detail
- [ ] `/submit` form uploads files correctly
- [ ] Submission creates database entry
- [ ] `/admin` login works
- [ ] `/admin/submissions` lists submissions
- [ ] Approve submission creates skill
- [ ] All links in header work
- [ ] Mobile responsive
- [ ] No console errors

---

## 📁 Final File Structure

```
src/
├── app/
│   ├── api/                    # ✅ KEEP (backend)
│   │   ├── submit/route.ts
│   │   ├── skills/
│   │   │   ├── route.ts
│   │   │   └── [slug]/route.ts  # NEW
│   │   ├── auth/[...all]/route.ts
│   │   └── admin/submissions/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── page.tsx                # 🔄 REPLACED (v0)
│   ├── layout.tsx              # 🔄 REPLACED (v0)
│   ├── globals.css             # 🔄 REPLACED (v0)
│   ├── not-found.tsx           # 🔄 UPDATE styling
│   ├── skills/
│   │   ├── page.tsx            # 🆕 NEW (v0 styled)
│   │   └── [slug]/page.tsx     # 🆕 NEW (v0 styled)
│   ├── submit/page.tsx         # 🔄 RESTYLE (v0 theme)
│   └── admin/                  # 🔄 RESTYLE (v0 theme)
│       ├── page.tsx
│       └── submissions/
│           ├── layout.tsx
│           ├── page.tsx
│           └── [id]/page.tsx
├── components/
│   ├── ui/                     # 🆕 NEW (from v0)
│   │   ├── badge.tsx
│   │   └── button.tsx
│   ├── header.tsx              # 🆕 NEW (from v0)
│   ├── footer.tsx              # 🆕 NEW (from v0)
│   ├── hero-section.tsx        # 🆕 NEW (from v0)
│   ├── agents-list.tsx         # 🆕 NEW (from v0)
│   ├── what-are-skills.tsx     # 🆕 NEW (from v0)
│   ├── featured-skills.tsx     # 🆕 NEW (from v0, modified)
│   ├── recently-updated.tsx    # 🆕 NEW (from v0, modified)
│   ├── skill-card.tsx          # 🆕 NEW (from v0, modified)
│   ├── cta-section.tsx         # 🆕 NEW (from v0)
│   ├── theme-provider.tsx      # 🆕 NEW (from v0)
│   └── sprocket.tsx            # 🆕 NEW (from v0)
├── db/                         # ✅ KEEP (backend)
│   ├── index.ts
│   └── schema.ts
├── lib/
│   ├── auth.ts                 # ✅ KEEP (backend)
│   ├── auth-client.ts          # ✅ KEEP (backend)
│   ├── utils.ts                # 🆕 NEW (cn helper)
│   ├── api.ts                  # 🆕 NEW (data fetching)
│   └── constants.ts            # 🆕 NEW (agents mapping)
├── data/
│   └── skills.json             # ✅ KEEP (reference)
└── types/
    └── index.ts                # 🔄 UPDATE (merge types)
```

---

## ⏱️ Estimated Timeline

| Phase | Task | Time |
|-------|------|------|
| 1 | Preparation & Dependencies | 30 min |
| 2 | Copy v0 Components | 20 min |
| 3 | Replace Styles | 10 min |
| 4 | Update Homepage | 30 min |
| 5 | Wire Up Data Fetching | 1 hour |
| 6 | Create Missing Pages | 2 hours |
| 7 | Add Missing API | 20 min |
| 8 | Header Navigation | 15 min |
| 9 | Cleanup | 15 min |
| 10 | Testing | 1 hour |

**Total Estimated Time:** ~6 hours

---

## ⚠️ Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Style conflicts | Medium | Test each component after copy |
| Import path issues | Low | IDE refactoring tools |
| Auth breaking | High | Test admin flows early |
| Missing fonts | Low | Verify Google Fonts loaded |
| Cache issues | Low | Clear `.next` folder |

---

## 🚀 Post-Integration

After successful integration:
1. Run full test suite
2. Test on mobile devices
3. Check Lighthouse scores
4. Update README
5. Create PR for review
6. Deploy to staging
7. Merge to main

---

**Ready for review. Do not execute without approval.**

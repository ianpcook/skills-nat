# Skills N'at

Skills for your AI agents, n'at. A Pittsburgh-born marketplace for discovering, sharing, and installing skills for Claude Code, Cursor, Codex, and more.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) 16
- **Database:** PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Auth:** [better-auth](https://better-auth.com/)
- **Styling:** Tailwind CSS + shadcn/ui

## Database Setup

```bash
# Generate migrations
npm run db:generate

# Push schema to database
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

## Deploy on Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

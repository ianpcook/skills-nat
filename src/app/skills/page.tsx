import { Suspense } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SkillCard } from '@/components/skill-card';
import { toDisplaySkill } from '@/lib/skill-utils';
import { AGENTS, CATEGORIES } from '@/lib/constants';
import { db, skills } from '@/db';
import { desc, ilike, or, sql, eq } from 'drizzle-orm';

// Force dynamic rendering to always fetch fresh skills data
export const dynamic = 'force-dynamic';

const DEFAULT_PAGE_SIZE = 12;

interface SkillsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    agent?: string;
  }>;
}

const getSkills = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  agent?: string;
}) => {
  if (!db) {
    return {
      skills: [],
      pagination: { page: 1, limit: DEFAULT_PAGE_SIZE, total: 0, totalPages: 0 },
    };
  }

  const page = params.page || 1;
  const limit = params.limit || DEFAULT_PAGE_SIZE;
  const offset = (page - 1) * limit;

  // Build where conditions
  const conditions = [sql`${skills.approvedAt} IS NOT NULL`];

  if (params.search) {
    conditions.push(
      or(
        ilike(skills.name, `%${params.search}%`),
        ilike(skills.description, `%${params.search}%`),
        ilike(skills.slug, `%${params.search}%`)
      )!
    );
  }

  if (params.category) {
    conditions.push(eq(skills.category, params.category));
  }

  if (params.agent) {
    conditions.push(sql`${skills.agents} @> ${JSON.stringify([params.agent])}::jsonb`);
  }

  const whereClause = conditions.reduce((a, b) => sql`${a} AND ${b}`);

  // Count total
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(skills)
    .where(whereClause);

  const total = Number(countResult[0]?.count || 0);

  // Fetch skills
  const results = await db
    .select()
    .from(skills)
    .where(whereClause)
    .orderBy(desc(skills.stars), desc(skills.approvedAt))
    .limit(limit)
    .offset(offset);

  return {
    skills: results,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

function SkillsLoading() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-64 animate-pulse border-4 border-foreground bg-card shadow-[6px_6px_0_0_theme(colors.foreground)]"
        />
      ))}
    </div>
  );
}

async function SkillsGrid({
  page,
  search,
  category,
  agent,
}: {
  page: number;
  search?: string;
  category?: string;
  agent?: string;
}) {
  const data = await getSkills({
    page,
    limit: 12,
    search,
    category,
    agent,
  });

  const skills = data.skills || [];
  const pagination = data.pagination || { page: 1, totalPages: 1, total: 0 };

  if (skills.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border-4 border-foreground bg-pop-yellow shadow-[4px_4px_0_0_theme(colors.foreground)]">
          <Search className="h-8 w-8 text-foreground" />
        </div>
        <h3 className="text-xl font-black uppercase text-foreground">
          No skills found
        </h3>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your search or filters
        </p>
        <Link
          href="/skills"
          className="mt-4 inline-block text-sm font-bold uppercase text-pop-pink hover:underline"
        >
          Clear all filters
        </Link>
      </div>
    );
  }

  // Build pagination URL helper
  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    params.set('page', String(newPage));
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (agent) params.set('agent', agent);
    return `/skills?${params.toString()}`;
  };

  return (
    <>
      {/* Results count */}
      <div className="mb-6 text-sm text-muted-foreground">
        Showing {skills.length} of {pagination.total} skills
      </div>

      {/* Skills Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {skills.map((skill: any) => (
          <Link key={skill.id} href={`/skills/${skill.slug}`} className="h-full">
            <SkillCard skill={toDisplaySkill(skill)} />
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          {pagination.page > 1 ? (
            <Link
              href={buildPageUrl(pagination.page - 1)}
              className="flex items-center gap-1 border-3 border-foreground bg-card px-4 py-2 text-sm font-bold uppercase text-foreground shadow-[3px_3px_0_0_theme(colors.foreground)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_theme(colors.foreground)] hover:bg-pop-cyan"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Link>
          ) : (
            <span className="flex cursor-not-allowed items-center gap-1 border-3 border-foreground/50 bg-card/50 px-4 py-2 text-sm font-bold uppercase text-muted-foreground">
              <ChevronLeft className="h-4 w-4" />
              Previous
            </span>
          )}

          <span className="px-4 py-2 text-sm font-bold uppercase text-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          {pagination.page < pagination.totalPages ? (
            <Link
              href={buildPageUrl(pagination.page + 1)}
              className="flex items-center gap-1 border-3 border-foreground bg-card px-4 py-2 text-sm font-bold uppercase text-foreground shadow-[3px_3px_0_0_theme(colors.foreground)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_theme(colors.foreground)] hover:bg-pop-cyan"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="flex cursor-not-allowed items-center gap-1 border-3 border-foreground/50 bg-card/50 px-4 py-2 text-sm font-bold uppercase text-muted-foreground">
              Next
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </div>
      )}
    </>
  );
}

export default async function SkillsPage({ searchParams }: SkillsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || '';
  const category = params.category || '';
  const agent = params.agent || '';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Header - Pop Art Style, left-aligned */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-2 bg-pop-cyan shrink-0" />
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                <span className="text-pop-cyan">Skills</span> Directory
              </h1>
              <div className="h-2 flex-1 bg-foreground" />
            </div>
            <p className="text-lg text-muted-foreground">
              Discover skills to supercharge your AI agents
            </p>
          </div>

          {/* Search Form - Pop Art Style */}
          <form action="/skills" method="GET" className="mb-8">
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground" />
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Search skills by name or description..."
                  className="w-full border-3 border-foreground bg-card py-3 pl-12 pr-4 text-foreground placeholder-muted-foreground font-medium focus:outline-none focus:bg-pop-yellow/20"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  name="category"
                  defaultValue={category}
                  className="w-full appearance-none border-3 border-foreground bg-card px-4 py-3 pr-10 text-foreground font-bold uppercase focus:outline-none focus:bg-pop-yellow/20 sm:w-48"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-foreground" />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 py-3 px-6 bg-pop-pink text-foreground font-black uppercase border-3 border-foreground shadow-[4px_4px_0_0_theme(colors.foreground)] hover:shadow-[2px_2px_0_0_theme(colors.foreground)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>

            {/* Active Filters */}
            {(search || category || agent) && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold uppercase text-muted-foreground">Active filters:</span>
                {search && (
                  <span className="border-2 border-foreground bg-pop-yellow px-3 py-1 text-sm font-bold text-foreground">
                    &quot;{search}&quot;
                  </span>
                )}
                {category && (
                  <span className="border-2 border-foreground bg-pop-cyan px-3 py-1 text-sm font-bold text-foreground">
                    {category}
                  </span>
                )}
                {agent && (
                  <span className="border-2 border-foreground bg-pop-lime px-3 py-1 text-sm font-bold text-foreground">
                    Agent: {AGENTS.find(a => a.id === agent)?.name || agent}
                  </span>
                )}
                <Link
                  href="/skills"
                  className="text-sm font-bold uppercase text-pop-pink hover:underline"
                >
                  Clear all
                </Link>
              </div>
            )}
          </form>

          {/* Agent Pills - Pop Art Style */}
          <div className="mb-10 border-y-4 border-foreground py-6">
            <p className="text-sm font-black uppercase tracking-wide text-foreground mb-4">Filter by agent</p>
            <div className="flex flex-wrap gap-0">
              {AGENTS.map((agentItem) => {
                const isActive = agent === agentItem.id;
                // Build URL preserving other filters
                const agentUrl = (() => {
                  const params = new URLSearchParams();
                  if (search) params.set('search', search);
                  if (category) params.set('category', category);
                  if (!isActive) params.set('agent', agentItem.id);
                  const query = params.toString();
                  return query ? `/skills?${query}` : '/skills';
                })();

                return (
                  <Link
                    key={agentItem.id}
                    href={agentUrl}
                    className={`flex items-center gap-2 border border-foreground px-3 py-2 text-xs font-black uppercase transition-all hover:scale-105 ${
                      isActive
                        ? 'bg-foreground text-card'
                        : 'bg-card text-foreground hover:bg-pop-yellow'
                    }`}
                  >
                    <span
                      className="h-2 w-2"
                      style={{ backgroundColor: agentItem.color }}
                    />
                    {agentItem.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Skills Grid */}
          <Suspense fallback={<SkillsLoading />}>
            <SkillsGrid page={page} search={search} category={category} agent={agent} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}

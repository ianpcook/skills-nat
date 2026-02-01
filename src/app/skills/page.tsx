import { Suspense } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SkillCard, toDisplaySkill } from '@/components/skill-card';
import { AGENTS, CATEGORIES } from '@/lib/constants';

// Force dynamic rendering to always fetch fresh skills data
export const dynamic = 'force-dynamic';

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
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.category) searchParams.set('category', params.category);
  if (params.agent) searchParams.set('agent', params.agent);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/skills?${searchParams}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch skills');
  }

  return res.json();
};

function SkillsLoading() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-64 animate-pulse rounded-lg bg-card"
          style={{ boxShadow: 'var(--shadow-card)' }}
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
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-card" style={{ boxShadow: 'var(--shadow-card)' }}>
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-serif text-lg font-medium text-foreground">
          No skills found
        </h3>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your search or filters
        </p>
        <Link
          href="/skills"
          className="mt-4 inline-block text-sm font-medium text-[--teal] hover:underline"
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
          <Link key={skill.id} href={`/skills/${skill.slug}`}>
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
              className="flex items-center gap-1 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Link>
          ) : (
            <span className="flex cursor-not-allowed items-center gap-1 rounded-md border border-border bg-card/50 px-4 py-2 text-sm font-medium text-muted-foreground">
              <ChevronLeft className="h-4 w-4" />
              Previous
            </span>
          )}

          <span className="px-4 py-2 text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          {pagination.page < pagination.totalPages ? (
            <Link
              href={buildPageUrl(pagination.page + 1)}
              className="flex items-center gap-1 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="flex cursor-not-allowed items-center gap-1 rounded-md border border-border bg-card/50 px-4 py-2 text-sm font-medium text-muted-foreground">
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

      <main className="section">
        <div className="section-inner">
          {/* Header */}
          <div className="mb-10">
            <h1 className="section-title-lg">Skills Directory</h1>
            <p className="section-subtitle">
              Discover skills to supercharge your AI agents
            </p>
          </div>

          {/* Search Form */}
          <form action="/skills" method="GET" className="mb-8">
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Search skills by name or description..."
                  className="w-full rounded-md border border-border bg-card py-3 pl-12 pr-4 text-foreground placeholder-muted-foreground transition-colors focus:border-[--teal] focus:outline-none focus:ring-1 focus:ring-[--teal]"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  name="category"
                  defaultValue={category}
                  className="w-full appearance-none rounded-md border border-border bg-card px-4 py-3 pr-10 text-foreground transition-colors focus:border-[--teal] focus:outline-none focus:ring-1 focus:ring-[--teal] sm:w-48"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-muted-foreground" />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="btn-primary flex items-center justify-center gap-2 py-3"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>

            {/* Active Filters */}
            {(search || category || agent) && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {search && (
                  <span className="rounded-md border border-border bg-card px-3 py-1 text-sm text-foreground">
                    &quot;{search}&quot;
                  </span>
                )}
                {category && (
                  <span className="rounded-md border border-border bg-card px-3 py-1 text-sm text-foreground">
                    {category}
                  </span>
                )}
                {agent && (
                  <span className="rounded-md border border-border bg-card px-3 py-1 text-sm text-foreground">
                    Agent: {AGENTS.find(a => a.id === agent)?.name || agent}
                  </span>
                )}
                <Link
                  href="/skills"
                  className="text-sm font-medium text-[--teal] hover:underline"
                >
                  Clear all
                </Link>
              </div>
            )}
          </form>

          {/* Agent Pills */}
          <div className="mb-10 border-y border-border py-6">
            <p className="label-text mb-4">Filter by agent</p>
            <div className="flex flex-wrap gap-2">
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
                    className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
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

'use client';

import { useState, useMemo } from 'react';
import SkillCard from '@/components/SkillCard';
import skillsData from '@/data/skills.json';
import { Skill } from '@/types';

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'name'>('popular');

  const skills = skillsData.skills as Skill[];
  const categories = skillsData.categories;
  const agents = skillsData.agents;

  const filteredSkills = useMemo(() => {
    let result = [...skills];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (skill) =>
          skill.name.toLowerCase().includes(query) ||
          skill.description.toLowerCase().includes(query) ||
          skill.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          skill.author.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter(
        (skill) => skill.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
      );
    }

    // Filter by agent
    if (selectedAgent) {
      result = result.filter((skill) => skill.agents.includes(selectedAgent));
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'recent':
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [skills, searchQuery, selectedCategory, selectedAgent, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedAgent(null);
    setSortBy('popular');
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedAgent;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-4">Skills Directory</h1>
          <p className="text-[#bfbfbf] text-lg">
            Browse {skills.length} skills from the community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#807c73]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search skills by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#1d1e1f] border border-[#2a2520] rounded-xl text-[#f5f0e6] placeholder-[#807c73] focus:outline-none focus:border-[#ffbc20] transition-colors"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="appearance-none px-4 py-2 pr-10 bg-[#1d1e1f] border border-[#2a2520] rounded-lg text-[#f5f0e6] focus:outline-none focus:border-[#ffbc20] transition-colors cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#807c73] pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Agent Filter */}
            <div className="relative">
              <select
                value={selectedAgent || ''}
                onChange={(e) => setSelectedAgent(e.target.value || null)}
                className="appearance-none px-4 py-2 pr-10 bg-[#1d1e1f] border border-[#2a2520] rounded-lg text-[#f5f0e6] focus:outline-none focus:border-[#ffbc20] transition-colors cursor-pointer"
              >
                <option value="">All Agents</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#807c73] pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popular' | 'recent' | 'name')}
                className="appearance-none px-4 py-2 pr-10 bg-[#1d1e1f] border border-[#2a2520] rounded-lg text-[#f5f0e6] focus:outline-none focus:border-[#ffbc20] transition-colors cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="recent">Recently Updated</option>
                <option value="name">Name A-Z</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#807c73] pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-[#ffbc20] hover:text-[#ffd980] transition-colors"
              >
                Clear filters
              </button>
            )}

            {/* Results Count */}
            <div className="ml-auto text-sm text-[#807c73]">
              {filteredSkills.length} {filteredSkills.length === 1 ? 'skill' : 'skills'} found
            </div>
          </div>
        </div>

        {/* Agent Pills */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedAgent === agent.id
                    ? 'bg-[#ffbc20]/20 text-[#ffd980] border border-[#ffbc20]/50'
                    : 'bg-[#1d1e1f] text-[#bfbfbf] border border-[#2a2520] hover:border-[#ffbc20]/30'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: agent.color }}
                />
                {agent.name}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        {filteredSkills.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1d1e1f] flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#807c73]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No skills found</h3>
            <p className="text-[#807c73] mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-[#ffbc20] hover:bg-[#ffd980] rounded-lg text-sm font-medium text-[#1a160d] transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

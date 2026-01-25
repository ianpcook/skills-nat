import { type Skill } from "@/db/schema";

// Base URL for API calls - empty string for same-origin
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export interface SkillsResponse {
  skills: Skill[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

/**
 * Fetch featured skills for the homepage
 * Returns up to 4 skills ordered by stars
 */
export async function getFeaturedSkills(): Promise<Skill[]> {
  try {
    const res = await fetch(`${API_BASE}/api/skills?limit=4`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!res.ok) {
      console.error('[API] Failed to fetch featured skills:', res.status);
      return [];
    }
    
    const data: SkillsResponse = await res.json();
    return data.skills || [];
  } catch (error) {
    console.error('[API] Error fetching featured skills:', error);
    return [];
  }
}

/**
 * Fetch recently updated skills for the homepage
 * Returns up to 4 skills
 */
export async function getRecentSkills(): Promise<Skill[]> {
  try {
    const res = await fetch(`${API_BASE}/api/skills?limit=4`, {
      next: { revalidate: 60 } // Cache for 1 minute
    });
    
    if (!res.ok) {
      console.error('[API] Failed to fetch recent skills:', res.status);
      return [];
    }
    
    const data: SkillsResponse = await res.json();
    return data.skills || [];
  } catch (error) {
    console.error('[API] Error fetching recent skills:', error);
    return [];
  }
}

/**
 * Fetch all skills with pagination, search, and category filters
 */
export async function getAllSkills(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}): Promise<SkillsResponse> {
  try {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.search) searchParams.set('search', params.search);
    if (params.category) searchParams.set('category', params.category);
    
    const url = `${API_BASE}/api/skills?${searchParams.toString()}`;
    const res = await fetch(url, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      console.error('[API] Failed to fetch skills:', res.status);
      return {
        skills: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasMore: false }
      };
    }
    
    return res.json();
  } catch (error) {
    console.error('[API] Error fetching skills:', error);
    return {
      skills: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasMore: false }
    };
  }
}

/**
 * Fetch a single skill by slug
 */
export async function getSkillBySlug(slug: string): Promise<Skill | null> {
  try {
    const res = await fetch(`${API_BASE}/api/skills/${slug}`, {
      next: { revalidate: 300 }
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      console.error('[API] Failed to fetch skill:', res.status);
      return null;
    }
    
    const data = await res.json();
    return data.skill || null;
  } catch (error) {
    console.error('[API] Error fetching skill:', error);
    return null;
  }
}

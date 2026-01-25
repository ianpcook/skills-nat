import { type Skill } from "@/db/schema";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { desc, eq, like, or, sql } from "drizzle-orm";

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
 * Queries database directly (server component safe)
 */
export async function getFeaturedSkills(): Promise<Skill[]> {
  if (!db) {
    console.warn("[API] Database not available - returning empty skills");
    return [];
  }
  try {
    const result = await db
      .select()
      .from(skills)
      .where(sql`${skills.approvedAt} IS NOT NULL`)
      .orderBy(desc(skills.stars))
      .limit(4);
    return result;
  } catch (error) {
    console.error("Error fetching featured skills:", error);
    return [];
  }
}

/**
 * Fetch recently updated skills
 * Queries database directly (server component safe)
 */
export async function getRecentSkills(): Promise<Skill[]> {
  if (!db) {
    console.warn("[API] Database not available - returning empty skills");
    return [];
  }
  try {
    const result = await db
      .select()
      .from(skills)
      .where(sql`${skills.approvedAt} IS NOT NULL`)
      .orderBy(desc(skills.updatedAt))
      .limit(4);
    return result;
  } catch (error) {
    console.error("Error fetching recent skills:", error);
    return [];
  }
}

/**
 * Get all skills with pagination and filters
 */
export async function getAllSkills(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}): Promise<SkillsResponse> {
  const page = params.page || 1;
  const limit = Math.min(params.limit || 20, 100);
  const offset = (page - 1) * limit;

  if (!db) {
    console.warn("[API] Database not available - returning empty skills");
    return {
      skills: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasMore: false },
    };
  }

  try {
    let query = db.select().from(skills).where(sql`${skills.approvedAt} IS NOT NULL`);
    
    // Note: For full implementation, add search and category filters
    
    const result = await query.orderBy(desc(skills.updatedAt)).limit(limit).offset(offset);
    
    // Get total count
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(skills).where(sql`${skills.approvedAt} IS NOT NULL`);
    const total = Number(countResult[0]?.count || 0);
    
    return {
      skills: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: offset + result.length < total,
      },
    };
  } catch (error) {
    console.error("Error fetching skills:", error);
    return {
      skills: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasMore: false },
    };
  }
}

/**
 * Get a single skill by slug
 */
export async function getSkillBySlug(slug: string): Promise<Skill | null> {
  if (!db) {
    console.warn("[API] Database not available - returning null");
    return null;
  }
  try {
    const [skill] = await db
      .select()
      .from(skills)
      .where(eq(skills.slug, slug))
      .limit(1);
    
    if (!skill || !skill.approvedAt) {
      return null;
    }
    
    return skill;
  } catch (error) {
    console.error("Error fetching skill:", error);
    return null;
  }
}

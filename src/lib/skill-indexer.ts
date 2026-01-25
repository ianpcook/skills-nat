import { db } from '@/db';
import { skillEmbeddings, skills, type Skill } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateEmbedding, buildEmbeddingContent } from './embeddings';

/**
 * Index a skill by generating and storing its embedding.
 * Call this when a skill is approved or updated.
 */
export async function indexSkill(skill: Skill): Promise<void> {
  if (!db) {
    throw new Error('Database not available');
  }

  console.log(`[INDEXER] Indexing skill: ${skill.slug}`);

  // Build the content to embed
  const content = buildEmbeddingContent({
    name: skill.name,
    description: skill.description,
    shortDescription: skill.shortDescription,
    category: skill.category,
    author: skill.author,
  });

  // Generate embedding
  const embedding = await generateEmbedding(content);

  // Delete existing embedding for this skill (if any)
  await db
    .delete(skillEmbeddings)
    .where(eq(skillEmbeddings.skillId, skill.id));

  // Insert new embedding
  await db.insert(skillEmbeddings).values({
    skillId: skill.id,
    embedding,
    content,
  });

  console.log(`[INDEXER] Successfully indexed skill: ${skill.slug}`);
}

/**
 * Reindex all approved skills.
 * Useful for rebuilding the search index.
 */
export async function reindexAllSkills(): Promise<{ indexed: number; errors: number }> {
  if (!db) {
    throw new Error('Database not available');
  }

  console.log('[INDEXER] Starting full reindex');

  const allSkills = await db.select().from(skills);
  let indexed = 0;
  let errors = 0;

  for (const skill of allSkills) {
    try {
      await indexSkill(skill);
      indexed++;
    } catch (error) {
      console.error(`[INDEXER] Failed to index ${skill.slug}:`, error);
      errors++;
    }
  }

  console.log(`[INDEXER] Reindex complete: ${indexed} indexed, ${errors} errors`);
  return { indexed, errors };
}

/**
 * Remove a skill from the search index.
 */
export async function unindexSkill(skillId: string): Promise<void> {
  if (!db) {
    throw new Error('Database not available');
  }

  await db
    .delete(skillEmbeddings)
    .where(eq(skillEmbeddings.skillId, skillId));
}

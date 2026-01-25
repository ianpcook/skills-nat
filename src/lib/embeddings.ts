import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate an embedding vector for the given text using OpenAI's text-embedding-3-small model.
 * Returns a 1536-dimensional vector.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return response.data[0].embedding;
}

/**
 * Generate embedding content from a skill's metadata.
 * Combines name, description, and category for better semantic search.
 */
export function buildEmbeddingContent(skill: {
  name: string;
  description?: string | null;
  shortDescription?: string | null;
  category?: string | null;
  author?: string | null;
}): string {
  const parts = [
    skill.name,
    skill.shortDescription,
    skill.description,
    skill.category ? `Category: ${skill.category}` : null,
    skill.author ? `Author: ${skill.author}` : null,
  ].filter(Boolean);

  return parts.join('\n\n');
}

/**
 * Compute cosine similarity between two vectors.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

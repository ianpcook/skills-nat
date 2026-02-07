/**
 * Mock OpenAI Embeddings
 * 
 * Returns deterministic embeddings based on text hash.
 * Same input → same embedding → reproducible tests.
 */

// Simple string hash function
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate a deterministic 1536-dimensional embedding from text.
 * The same text will always produce the same embedding.
 */
export function mockEmbedding(text: string): number[] {
  const hash = simpleHash(text);
  const seed = hash / 2147483647; // Normalize to 0-1
  
  return Array(1536).fill(0).map((_, i) => {
    // Use a combination of hash and index for variation
    // Math.sin produces values between -1 and 1
    const value = Math.sin(seed * 10000 + i * 0.1) * 0.5;
    return value;
  });
}

/**
 * Mock OpenAI client that can be used in tests.
 * Implements the same interface as the real OpenAI client.
 */
export class MockOpenAI {
  embeddings = {
    create: async ({ input }: { model: string; input: string }) => {
      const text = Array.isArray(input) ? input[0] : input;
      return {
        data: [{ embedding: mockEmbedding(text) }],
        model: 'text-embedding-3-small-mock',
        usage: { prompt_tokens: text.length, total_tokens: text.length },
      };
    },
  };
}

// Track all embedding calls for assertions
export const embeddingCalls: { input: string; embedding: number[] }[] = [];

export function resetEmbeddingCalls() {
  embeddingCalls.length = 0;
}

/**
 * Create a mock embedding function that tracks calls.
 */
export async function trackedMockEmbedding(text: string): Promise<number[]> {
  const embedding = mockEmbedding(text);
  embeddingCalls.push({ input: text, embedding });
  return embedding;
}

/**
 * Test Setup
 * 
 * Configures the test environment with mocks.
 * Import this at the start of test files.
 */

import { MockOpenAI, resetEmbeddingCalls } from './twins/mock-openai';
import { MockResend, resetSentEmails } from './twins/mock-resend';

// Environment setup for tests
export function setupTestEnv() {
  // Use test database
  process.env.DATABASE_URL = 'postgresql://postgres:test@localhost:5433/skills_test';
  
  // Disable real API calls
  process.env.OPENAI_API_KEY = 'test-key-not-real';
  process.env.RESEND_API_KEY = 'test-key-not-real';
  
  // Mark as test environment
  process.env.NODE_ENV = 'test';
}

// Create mock instances
export const mockOpenAI = new MockOpenAI();
export const mockResend = new MockResend();

// Reset function for beforeEach
export function resetMocks() {
  resetEmbeddingCalls();
  resetSentEmails();
}

/**
 * Seed test skills into database.
 */
export async function seedTestSkills(db: any) {
  const { skills, skillEmbeddings } = await import('../src/db/schema');
  const { mockEmbedding } = await import('./twins/mock-openai');
  
  const testSkills = [
    {
      slug: 'pittsburgh-transit',
      name: 'Pittsburgh Transit Tracker',
      description: 'Track PRT buses and T light rail in real-time. Get arrival times for stops.',
      shortDescription: 'Real-time Pittsburgh transit tracking',
      category: 'transit',
    },
    {
      slug: 'weather-forecast',
      name: 'Weather CLI',
      description: 'Get current weather conditions and forecasts for any location.',
      shortDescription: 'Weather forecasts from CLI',
      category: 'utilities',
    },
    {
      slug: 'slack-bot-helper',
      name: 'Slack Bot Helper',
      description: 'Send messages, manage channels, and automate Slack workflows.',
      shortDescription: 'Slack automation tools',
      category: 'communication',
    },
  ];
  
  for (const skill of testSkills) {
    // Insert skill
    const [inserted] = await db.insert(skills).values({
      ...skill,
      files: [],
      agents: ['claude-code'],
    }).returning();
    
    // Generate and insert embedding
    const embeddingText = `${skill.name} ${skill.description}`;
    const embedding = mockEmbedding(embeddingText);
    
    await db.insert(skillEmbeddings).values({
      skillId: inserted.id,
      embedding,
    });
  }
  
  return testSkills;
}

/**
 * Clean up test data.
 */
export async function cleanupTestData(db: any) {
  const { skills, skillEmbeddings, submissions } = await import('../src/db/schema');
  const { sql } = await import('drizzle-orm');
  
  // Delete in order due to foreign keys
  await db.delete(skillEmbeddings);
  await db.delete(skills);
  await db.delete(submissions);
}

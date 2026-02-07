/**
 * Mock Services Index
 * 
 * Central export for all test mocks/twins.
 */

export * from './mock-openai';
export * from './mock-resend';

/**
 * Reset all mocks between tests.
 */
export function resetAllMocks() {
  const { resetEmbeddingCalls } = require('./mock-openai');
  const { resetSentEmails } = require('./mock-resend');
  
  resetEmbeddingCalls();
  resetSentEmails();
}

# Scenario: Search Relevance

**Purpose:** Verify that semantic search returns relevant results.

## Preconditions
- Application is running
- Test skills are seeded with embeddings
- Mock OpenAI returns deterministic embeddings

## Seed Data
Create skills with distinct topics:

```typescript
const testSkills = [
  {
    slug: 'pittsburgh-transit',
    name: 'Pittsburgh Transit Tracker',
    description: 'Track PRT buses and T light rail in real-time. Get arrival times for stops.',
    category: 'transit',
  },
  {
    slug: 'weather-forecast',
    name: 'Weather CLI',
    description: 'Get current weather conditions and forecasts for any location.',
    category: 'utilities',
  },
  {
    slug: 'slack-bot-helper',
    name: 'Slack Bot Helper',
    description: 'Send messages, manage channels, and automate Slack workflows.',
    category: 'communication',
  },
  {
    slug: 'postgres-admin',
    name: 'PostgreSQL Admin',
    description: 'Database administration tools for PostgreSQL. Run queries, manage schemas.',
    category: 'database',
  },
  {
    slug: 'github-actions',
    name: 'GitHub Actions Helper',
    description: 'Manage CI/CD workflows, trigger actions, and view run status.',
    category: 'devops',
  },
];
```

## Test Cases

### Case 1: Transit Query
- Search: "bus schedule times"
- Expected top result: "Pittsburgh Transit Tracker"
- Rationale: Contains transit/bus related content

### Case 2: Weather Query  
- Search: "forecast temperature rain"
- Expected top result: "Weather CLI"
- Rationale: Direct match on weather/forecast

### Case 3: Communication Query
- Search: "send team message notification"
- Expected top result: "Slack Bot Helper"
- Rationale: Messaging/communication context

### Case 4: Database Query
- Search: "sql database tables"
- Expected top result: "PostgreSQL Admin"
- Rationale: Database/SQL context

### Case 5: CI/CD Query
- Search: "deploy pipeline automation"
- Expected top result: "GitHub Actions Helper"
- Rationale: CI/CD/automation context

### Case 6: Ambiguous Query
- Search: "Pittsburgh"
- Expected: "Pittsburgh Transit Tracker" should rank highly
- Note: Tests geographic/local relevance

## Assertions

For each test case:
1. Call `GET /api/search?q=<query>`
2. Assert expected skill appears in top 3 results
3. Assert result score is above threshold (e.g., > 0.5)

## Notes on Mock Embeddings

With deterministic mock embeddings:
- Same skill description → same embedding every time
- Similar words should produce somewhat similar embeddings
- Tests validate the search *flow* even if semantic quality differs from real OpenAI

For true semantic testing, run occasionally against real API in staging.

## Expected Outcome
- Search returns results ordered by relevance
- Relevant skills appear in top positions
- No crashes or errors on edge cases

## Edge Cases to Test
- Empty query → appropriate error
- Very long query → truncated or handled gracefully
- Special characters → sanitized
- No results → empty array, not error

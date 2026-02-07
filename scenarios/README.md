# Scenario Testing

Dark Factory-inspired test infrastructure for Skills N'at.

## Philosophy

Following [StrongDM's Software Factory](https://factory.strongdm.ai) approach:

1. **Scenarios are holdout sets** — Human-readable test cases stored outside the main code, so coding agents can't "cheat" by reading them
2. **Selective twins** — Mock expensive external services (OpenAI, Resend) with deterministic fakes
3. **Local infrastructure** — Run Postgres locally for fast, isolated tests

## Structure

```
scenarios/
├── holdout/              # Scenario definitions (human-readable)
│   ├── submit-flow.md    # Skill submission workflow
│   ├── admin-approval.md # Admin review and approval
│   └── search-relevance.md # Search quality tests
├── twins/                # Mock services
│   ├── mock-openai.ts    # Deterministic embeddings
│   ├── mock-resend.ts    # Email capture (no real sends)
│   └── index.ts          # Central exports
├── tests/                # Playwright test implementations
│   └── submit-flow.spec.ts
├── setup.ts              # Test environment configuration
└── README.md
```

## Quick Start

### 1. Start test database

```bash
npm run test:db:up        # Start Postgres in Docker
npm run test:db:reset     # Reset and push schema
```

### 2. Run tests

```bash
npm test                  # Run all tests
npm run test:headed       # Run with browser visible
npm run test:ui           # Open Playwright UI
```

### 3. Stop test database

```bash
npm run test:db:down
```

## Writing New Scenarios

### 1. Define the scenario in `holdout/`

Create a markdown file describing:
- Preconditions
- Step-by-step actions
- Expected outcomes
- Cleanup steps

### 2. Implement in `tests/`

Create a `.spec.ts` file that automates the scenario using Playwright.

### 3. Add mocks if needed

If the scenario uses external services, add/update twins.

## Mock Services

### OpenAI Embeddings

`mock-openai.ts` provides:
- `mockEmbedding(text)` — Deterministic 1536-dim vectors
- `MockOpenAI` — Drop-in client replacement
- `embeddingCalls` — Array of all calls for assertions

### Resend Emails

`mock-resend.ts` provides:
- `mockSend(email)` — Captures emails without sending
- `MockResend` — Drop-in client replacement
- `sentEmails` — Array of captured emails
- `assertEmailSent(options)` — Helper for assertions

## Environment Variables

Tests run with:

```
DATABASE_URL=postgresql://postgres:test@localhost:5433/skills_test
OPENAI_API_KEY=test-mock-key
RESEND_API_KEY=test-mock-key
NODE_ENV=test
```

## CI Integration

Add to your CI workflow:

```yaml
- name: Start test DB
  run: docker compose -f docker-compose.test.yml up -d

- name: Wait for DB
  run: sleep 5

- name: Push schema
  run: npm run db:push
  env:
    DATABASE_URL: postgresql://postgres:test@localhost:5433/skills_test

- name: Install Playwright
  run: npx playwright install --with-deps chromium

- name: Run tests
  run: npm test
```

## Notes

- Tests run serially (single worker) for database consistency
- Screenshots captured on failure
- Trace recorded on first retry
- Mock embeddings are deterministic but not semantically meaningful
- For true semantic search testing, occasionally run against real OpenAI in staging

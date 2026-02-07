import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './scenarios/tests',
  fullyParallel: false, // Run tests serially for database consistency
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker for database tests
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run local dev server before tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      DATABASE_URL: 'postgresql://postgres:test@localhost:5433/skills_test',
      OPENAI_API_KEY: 'test-mock-key',
      RESEND_API_KEY: 'test-mock-key',
      NODE_ENV: 'test',
    },
  },
});

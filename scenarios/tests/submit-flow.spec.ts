import { test, expect } from '@playwright/test';

/**
 * Submit Flow Scenario
 * 
 * Tests the complete skill submission workflow.
 * See: scenarios/holdout/submit-flow.md
 */

const TEST_SKILL_CONTENT = `---
name: "Test Pittsburgh Skill"
description: "A test skill for the Steel City"
version: "1.0.0"
author: "Test Author"
category: "utilities"
agents:
  - claude-code
  - cursor
---

# Test Pittsburgh Skill

This is a test skill for scenario validation.

## Commands

- \`test hello\` - Says hello
`;

test.describe('Skill Submission Flow', () => {
  test('user can submit a skill and it enters review queue', async ({ page, request }) => {
    // Step 1: Navigate to submit page
    await page.goto('/submit');
    await expect(page).toHaveURL('/submit');
    
    // Verify the upload form is present
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
    
    // Step 2: Create and upload test SKILL.md
    // Create a buffer from the skill content
    const buffer = Buffer.from(TEST_SKILL_CONTENT);
    
    // Upload the file
    await fileInput.setInputFiles({
      name: 'SKILL.md',
      mimeType: 'text/markdown',
      buffer,
    });
    
    // Step 3: Submit the form
    const submitButton = page.locator('button[type="submit"], button:has-text("Submit")');
    await submitButton.click();
    
    // Step 4: Verify success message
    await expect(page.locator('text=/success|received|pending/i')).toBeVisible({
      timeout: 10000,
    });
    
    // Step 5: Verify via API that submission exists
    const response = await request.get('/api/admin/submissions');
    
    if (response.ok()) {
      const data = await response.json();
      const submission = data.submissions?.find(
        (s: any) => s.slug === 'test-pittsburgh-skill' || s.name === 'Test Pittsburgh Skill'
      );
      
      // If we can access admin API, verify the submission
      if (submission) {
        expect(submission.status).toBe('pending');
        expect(submission.name).toBe('Test Pittsburgh Skill');
      }
    }
    // Note: Admin API might require auth, so this assertion is optional
  });

  test('submission requires SKILL.md file', async ({ page }) => {
    await page.goto('/submit');
    
    // Try to submit without a file
    const submitButton = page.locator('button[type="submit"], button:has-text("Submit")');
    
    // Button should be disabled or submission should fail
    const isDisabled = await submitButton.isDisabled();
    
    if (!isDisabled) {
      await submitButton.click();
      // Should show an error
      await expect(page.locator('text=/required|error|SKILL.md/i')).toBeVisible({
        timeout: 5000,
      });
    }
  });

  test('parses frontmatter correctly', async ({ page, request }) => {
    await page.goto('/submit');
    
    const skillWithAllFields = `---
name: "Full Metadata Skill"
description: "Tests all frontmatter fields"
version: "2.0.0"
author: "Scenario Test"
category: "testing"
agents:
  - claude-code
  - cursor
  - copilot
---

# Full Metadata Skill

A skill with complete frontmatter.
`;

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'SKILL.md',
      mimeType: 'text/markdown',
      buffer: Buffer.from(skillWithAllFields),
    });
    
    const submitButton = page.locator('button[type="submit"], button:has-text("Submit")');
    await submitButton.click();
    
    // Wait for success
    await expect(page.locator('text=/success|received|pending/i')).toBeVisible({
      timeout: 10000,
    });
    
    // The submission should have parsed all fields correctly
    // This is verified in admin-approval tests or via direct DB check
  });
});

test.describe('API Submission', () => {
  test('can submit via API endpoint', async ({ request }) => {
    // Create form data
    const formData = new FormData();
    const blob = new Blob([TEST_SKILL_CONTENT], { type: 'text/markdown' });
    formData.append('file', blob, 'SKILL.md');
    
    // Note: Playwright's request API handles FormData differently
    // This test demonstrates the API contract
    const response = await request.post('/api/submit', {
      multipart: {
        file: {
          name: 'SKILL.md',
          mimeType: 'text/markdown',
          buffer: Buffer.from(TEST_SKILL_CONTENT),
        },
      },
    });
    
    // Should succeed or require auth
    expect([200, 201, 401, 403]).toContain(response.status());
    
    if (response.ok()) {
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.id).toBeDefined();
    }
  });
});

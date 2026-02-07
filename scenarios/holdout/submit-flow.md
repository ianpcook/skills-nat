# Scenario: Skill Submission Flow

**Purpose:** Verify that a user can submit a skill and it enters the review queue.

## Preconditions
- Application is running
- Database is clean or in known state
- Mock services are active (OpenAI, Resend)

## Steps

### 1. Navigate to Submit Page
- Go to `/submit`
- Assert: Page loads with upload form

### 2. Prepare Test Skill
Create a SKILL.md file with:
```yaml
---
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

- `test hello` - Says hello
```

### 3. Upload Skill
- Select the SKILL.md file
- Optionally add repository URL: `https://github.com/test/test-skill`
- Click Submit

### 4. Verify Success
- Assert: Success message appears: "Submission received and pending review"
- Assert: Submission ID is returned

### 5. Verify Database State
- Query: `SELECT * FROM submissions WHERE slug = 'test-pittsburgh-skill'`
- Assert: Record exists with:
  - `status = 'pending'`
  - `name = 'Test Pittsburgh Skill'`
  - `description` contains "Steel City"
  - `files` array contains SKILL.md content

### 6. Verify Email Notification
- Assert: MockResend captured email with:
  - Subject contains "New skill submission"
  - Body contains "Test Pittsburgh Skill"
  - Sent to admin email(s)

## Expected Outcome
- Submission created in database
- Admin notified via email
- User sees confirmation

## Cleanup
- Delete test submission from database

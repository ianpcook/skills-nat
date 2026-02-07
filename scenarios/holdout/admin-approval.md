# Scenario: Admin Approval Flow

**Purpose:** Verify that an admin can approve a pending submission and it becomes a published skill.

## Preconditions
- Application is running
- A pending submission exists (from submit-flow or seeded)
- Admin user is authenticated
- Mock services are active

## Seed Data
```sql
INSERT INTO submissions (slug, name, version, description, files, status)
VALUES (
  'test-approval-skill',
  'Test Approval Skill',
  '1.0.0',
  'A skill to test the approval flow',
  '[{"name": "SKILL.md", "content": "# Test", "size": 6}]'::jsonb,
  'pending'
);
```

## Steps

### 1. Login as Admin
- Navigate to `/admin`
- Assert: Redirected to auth if not logged in
- Login with admin credentials (or mock session)
- Assert: Admin dashboard loads

### 2. View Submissions Queue
- Navigate to `/admin/submissions`
- Assert: Page shows pending submissions
- Assert: "Test Approval Skill" is visible in the list

### 3. Open Submission Details
- Click on "Test Approval Skill"
- Assert: Navigates to `/admin/submissions/[id]`
- Assert: Shows skill details:
  - Name: "Test Approval Skill"
  - Status: "pending"
  - Files are viewable

### 4. Approve Submission
- Click "Approve" button
- Assert: Confirmation dialog or immediate action
- Confirm approval

### 5. Verify Approval Result
- Assert: Success message appears
- Assert: Submission status changes to "approved"
- Assert: Redirected to submissions list or skill page

### 6. Verify Skill is Published
- Query: `SELECT * FROM skills WHERE slug = 'test-approval-skill'`
- Assert: Skill record exists with:
  - `name = 'Test Approval Skill'`
  - `approved_at` is set

### 7. Verify Skill is Searchable
- Call: `GET /api/search?q=approval`
- Assert: Response includes "Test Approval Skill"
- Assert: Embedding was generated (check mock calls)

## Expected Outcome
- Submission marked as approved
- Skill created in skills table
- Skill indexed for search
- Skill appears in API responses

## Cleanup
- Delete test skill and submission

/**
 * Basic page load tests for Skills N'at
 * 
 * These tests verify that all main pages load correctly
 * and contain expected content.
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

describe('Page Load Tests', () => {
  describe('Homepage', () => {
    it('should load with 200 status', async () => {
      const response = await fetch(`${BASE_URL}/`);
      expect(response.status).toBe(200);
    });

    it("should contain Skills N'at branding", async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();
      expect(html).toContain("Skills N'at");
    });

    it('should contain expected hero text', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();
      expect(html).toContain('Skills for your');
      expect(html).toContain('AI agents');
    });

    it('should contain navigation links', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();
      expect(html).toContain('href="/skills"');
      expect(html).toContain('href="/submit"');
    });
  });

  describe('Skills Page', () => {
    it('should load with 200 status', async () => {
      const response = await fetch(`${BASE_URL}/skills`);
      expect(response.status).toBe(200);
    });
  });

  describe('Submit Page', () => {
    it('should load with 200 status', async () => {
      const response = await fetch(`${BASE_URL}/submit`);
      expect(response.status).toBe(200);
    });
  });

  describe('Admin Page', () => {
    it('should load with 200 status', async () => {
      const response = await fetch(`${BASE_URL}/admin`);
      // Admin page should load (may redirect to login, but should not 500)
      expect([200, 302, 401, 403]).toContain(response.status);
    });
  });
});

describe('API Route Tests', () => {
  describe('GET /api/skills', () => {
    it('should respond with JSON', async () => {
      const response = await fetch(`${BASE_URL}/api/skills`);
      // Should return 200 even if no database
      expect(response.status).toBe(200);
      const contentType = response.headers.get('content-type');
      expect(contentType).toContain('application/json');
    });

    it('should return skills array structure', async () => {
      const response = await fetch(`${BASE_URL}/api/skills`);
      const data = await response.json();
      expect(data).toHaveProperty('skills');
      expect(Array.isArray(data.skills)).toBe(true);
    });
  });

  describe('GET /api/skills with pagination', () => {
    it('should accept limit parameter', async () => {
      const response = await fetch(`${BASE_URL}/api/skills?limit=5`);
      expect(response.status).toBe(200);
    });

    it('should accept page parameter', async () => {
      const response = await fetch(`${BASE_URL}/api/skills?page=1`);
      expect(response.status).toBe(200);
    });
  });
});

describe('Static Assets', () => {
  it('should serve favicon', async () => {
    const response = await fetch(`${BASE_URL}/favicon.ico`);
    expect(response.status).toBe(200);
  });
});

/**
 * E2E smoke tests — run against any deployed instance.
 *
 * Default target: http://localhost:3000
 * Custom target:  BASE_URL=https://example.com npx playwright test
 *
 * Post-Docker-deploy:
 *   docker run -d -p 3000:3000 koenvangilst && npx playwright test
 */
import { expect, test } from '@playwright/test';

test.describe('Health & infrastructure', () => {
  test('health endpoint returns ok', async ({ request }) => {
    const res = await request.get('/health');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(typeof body.timestamp).toBe('string');
  });

  test('static assets are served with correct MIME type', async ({ request }) => {
    // Fetch the home page first to get a CSS file URL from it
    const page = await request.get('/');
    expect(page.ok()).toBeTruthy();
    const html = await page.text();
    const cssMatch = html.match(/href="([^"]*\.css[^"]*)"/);
    if (cssMatch) {
      const cssRes = await request.get(cssMatch[1]);
      expect(cssRes.ok()).toBeTruthy();
      expect(cssRes.headers()['content-type']).toContain('text/css');
    }
  });

  test('static assets have long cache headers', async ({ request }) => {
    const page = await request.get('/');
    const html = await page.text();
    const assetMatch = html.match(/src="(\/assets\/[^"]+\.js[^"]*)"/);
    if (assetMatch) {
      const assetRes = await request.get(assetMatch[1]);
      expect(assetRes.ok()).toBeTruthy();
      const cc = assetRes.headers()['cache-control'] ?? '';
      expect(cc).toContain('max-age=31536000');
      expect(cc).toContain('immutable');
    }
  });

  test('sitemap.xml is served', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toContain('<urlset');
    expect(body).toContain('koenvangilst.nl');
  });

  test('RSS feed is served', async ({ request }) => {
    const res = await request.get('/feed.xml');
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toContain('<rss');
    expect(body).toContain('Koen van Gilst');
  });
});

test.describe('Pages render', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Koen van Gilst/i);
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('home page has navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /lab/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /photography/i })).toBeVisible();
  });

  test('lab listing page loads with posts', async ({ page }) => {
    await page.goto('/lab');
    await expect(page).toHaveTitle(/Lab/i);
    // Should have at least one blog post link
    const links = page.getByRole('article');
    await expect(links.first()).toBeVisible();
  });

  test('a blog post loads', async ({ page }) => {
    // Use a known stable slug
    await page.goto('/lab/pong-wars');
    await expect(page.getByRole('main')).toBeVisible();
    // Should have a heading
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('photography page loads with images', async ({ page }) => {
    await page.goto('/photography');
    await expect(page).toHaveTitle(/Photography/i);
    // Should have images
    const images = page.getByRole('img');
    await expect(images.first()).toBeVisible();
  });

  test('about/home page shows commit hash in footer', async ({ page }) => {
    await page.goto('/');
    // Footer should exist
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('404 page for unknown route', async ({ page }) => {
    const res = await page.goto('/this-route-does-not-exist-ever');
    // Should be a 404 (or at minimum render something)
    expect(res?.status()).toBe(404);
  });
});

test.describe('Security headers', () => {
  test('CSP header is set on HTML pages', async ({ request }) => {
    const res = await request.get('/');
    const csp = res.headers()['content-security-policy'];
    expect(csp).toBeTruthy();
    expect(csp).toContain("default-src 'self'");
  });

  test('X-Content-Type-Options is set', async ({ request }) => {
    const res = await request.get('/');
    expect(res.headers()['x-content-type-options']).toBe('nosniff');
  });

  test('X-Frame-Options is set', async ({ request }) => {
    const res = await request.get('/');
    expect(res.headers()['x-frame-options']).toBe('DENY');
  });
});

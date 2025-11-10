import { test, expect } from '@playwright/test';

test.describe('Project Pages', () => {
  test('should load generative art gallery', async ({ page }) => {
    await page.goto('/lab/gen-art-gallery');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check that the page loaded successfully (no 404)
    await expect(page.locator('body')).toBeVisible();

    // The title should not be a 404 page
    const title = await page.title();
    expect(title).not.toContain('404');
    expect(title).not.toContain('Not Found');
  });

  test('should load prognosis-2100 page', async ({ page }) => {
    await page.goto('/lab/prognosis-2100');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check that the page loaded successfully
    await expect(page.locator('body')).toBeVisible();

    // The title should not be a 404 page
    const title = await page.title();
    expect(title).not.toContain('404');
    expect(title).not.toContain('Not Found');
  });

  test('should load CO2 tracking project', async ({ page }) => {
    await page.goto('/lab/co2');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check that the page loaded successfully
    await expect(page.locator('body')).toBeVisible();

    // The title should not be a 404 page
    const title = await page.title();
    expect(title).not.toContain('404');
    expect(title).not.toContain('Not Found');
  });

  test('should handle 404 for non-existent project', async ({ page }) => {
    const response = await page.goto('/lab/non-existent-project-xyz-123');

    // Should return 404 status
    expect(response?.status()).toBe(404);
  });
});

test.describe('Tag Pages', () => {
  test('should load tag pages', async ({ page }) => {
    await page.goto('/tag/side-project');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check that the page loaded successfully
    await expect(page.locator('body')).toBeVisible();

    // The title should contain information about the tag
    const title = await page.title();
    expect(title).not.toContain('404');
    expect(title).not.toContain('Not Found');
  });
});

// test.describe('RSS Feed', () => {
//   test('should generate RSS feed', async ({ page }) => {
//     const response = await page.goto('/feed.xml');

//     // Should return 200 status
//     expect(response?.status()).toBe(200);

//     // Should have XML content type
//     const contentType = response?.headers()['content-type'];
//     expect(contentType).toContain('xml');

//     // Should contain RSS content
//     const content = await page.content();
//     expect(content).toContain('<?xml');
//     expect(content).toContain('rss');
//   });
// });

import { test, expect } from '@playwright/test';

test.describe('Photography Page', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/photography');
    await expect(page).toHaveTitle(/Photography/);
  });

  test('should display photo grid', async ({ page }) => {
    await page.goto('/photography');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check that there are images displayed
    const images = page.locator('img');
    const count = await images.count();

    // There should be at least one photo
    expect(count).toBeGreaterThan(0);
  });

  test('should have clickable photos', async ({ page }) => {
    await page.goto('/photography');
    await page.waitForLoadState('networkidle');

    // Find photo links (links to individual photo pages)
    const photoLinks = page.locator('a[href^="/photography/"]');
    const count = await photoLinks.count();

    // There should be at least one photo link
    expect(count).toBeGreaterThan(0);

    // Click the first photo
    const firstPhotoLink = photoLinks.first();
    await expect(firstPhotoLink).toBeVisible();

    const href = await firstPhotoLink.getAttribute('href');
    await firstPhotoLink.click();

    // Should navigate to the individual photo page
    await expect(page).toHaveURL(new RegExp(href!));
  });
});

import { test, expect } from '@playwright/test';

test.describe('Lab Page', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/lab');
    await expect(page).toHaveTitle(/Labs/);
  });

  test('should display main content', async ({ page }) => {
    await page.goto('/lab');

    // Check for description text
    await expect(page.getByText(/collection of coding experiments, blog posts and side projects/i)).toBeVisible();
  });

  test('should display project list', async ({ page }) => {
    await page.goto('/lab');

    // Wait for the page to load and check that we have some content
    // The ProjectBrowser should render project cards
    await page.waitForLoadState('networkidle');

    // Check that there are project links (articles/projects should be clickable)
    const projectLinks = page.locator('a[href^="/lab/"]');
    const count = await projectLinks.count();

    // There should be at least one project
    expect(count).toBeGreaterThan(0);
  });

  test('should filter projects with query parameter', async ({ page }) => {
    // Test filtering by side-project tag
    await page.goto('/lab?q=side-project');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Page should still load successfully
    await expect(page).toHaveTitle(/Labs/);
  });

  test('should navigate to a project when clicked', async ({ page }) => {
    await page.goto('/lab');
    await page.waitForLoadState('networkidle');

    // Find the first project link and click it
    const firstProjectLink = page.locator('a[href^="/lab/"]').first();
    await expect(firstProjectLink).toBeVisible();

    const href = await firstProjectLink.getAttribute('href');
    await firstProjectLink.click();

    // Should navigate to the project page
    await expect(page).toHaveURL(new RegExp(href!));
  });
});

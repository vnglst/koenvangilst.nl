import { expect, test } from '@playwright/test';

test.describe('Article tag filtering', () => {
  test('filters articles by tag query', async ({ page }) => {
    await page.goto('/articles?q=article');

    await expect(page).toHaveURL(/\/articles\?q=article$/);
    await expect(page.locator('main a[href^="/articles/"]').first()).toBeVisible();
  });

  test('handles special regex characters without crashing', async ({ page }) => {
    await page.goto('/articles?q=[test');

    await expect(page.getByText('No matching articles')).toBeVisible();
  });
});

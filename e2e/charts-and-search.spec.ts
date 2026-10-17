import { expect, test } from '@playwright/test';

test.describe('Lab tag filtering', () => {
  test('filters articles by tag query', async ({ page }) => {
    await page.goto('/lab?q=article');

    await expect(page).toHaveURL(/\/lab\?q=article$/);
    await expect(page.locator('main a[href^="/lab/"]').first()).toBeVisible();
  });

  test('handles special regex characters without crashing', async ({ page }) => {
    await page.goto('/lab?q=[test');

    await expect(page.getByText('No matching entries')).toBeVisible();
  });
});

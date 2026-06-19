import { expect, test } from '@playwright/test';

test.describe('photography', () => {
  test('photography page loads with correct title', async ({ page }) => {
    await page.goto('/photography');

    await expect(page).toHaveTitle(/Photography/i);
  });

  test('photo gallery can render its fullscreen viewer state', async ({ page }) => {
    await page.goto('/photography?photo=0-gallery');

    await expect(page).toHaveTitle(/Photography/i);
    await expect(page).toHaveURL(/\/photography\?photo=0-gallery$/);
    await expect(page.getByRole('button', { name: /back/i })).toBeVisible();
  });
});

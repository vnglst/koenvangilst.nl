import { expect, test } from '@playwright/test';

test.describe('site shell', () => {
  test('homepage exposes the core navigation and recent articles', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Koen van Gilst/i);
    await expect(page.getByRole('heading', { level: 1, name: 'Koen van Gilst' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: /main navigation/i })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Lab' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Photography' })).toBeVisible();
    await expect(page.getByText('Recent articles')).toBeVisible();
    await expect(page.locator('main section ul li a').first()).toBeVisible();
  });

  test('unknown routes render the not found page', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist-ever');

    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: /404 - Not found/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /return home/i })).toBeVisible();
  });
});

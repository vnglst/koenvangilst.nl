import { expect, test } from '@playwright/test';

test.describe('photography', () => {
  test('collection loads with natural image proportions', async ({ page }) => {
    await page.goto('/photography');
    await expect(page).toHaveTitle(/Photography/i);
    await expect(page.getByRole('heading', { name: 'Photography', exact: true })).toBeVisible();
    const image = page.locator('.photo-grid img').first();
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('width', '640');
    await expect(image).toHaveAttribute('height', '480');
  });

  test('photo deep links render the selected photograph and its full date on the server', async ({ page }) => {
    const response = await page.request.get('/photography/14');
    const html = await response.text();
    expect(html).toContain('Paris, France');
    expect(html).toContain('January 1, 2026');
    await page.goto('/photography/14');
    const caption = page.locator('.photo-caption');
    await expect(caption.getByText('Paris, France', { exact: true })).toBeVisible();
    await expect(caption.locator('time')).toHaveText('January 1, 2026');
    await expect(page.locator('.photo-slide img')).toHaveCount(1);
  });

  test('horizontal keys update the photo URL, caption, and boundary controls', async ({ page }) => {
    // Establish client navigation before sending window keys: SSR controls can
    // appear before hydration, and window key events cannot be replayed.
    await page.goto('/photography/15');
    await page.getByRole('button', { name: 'Previous photograph' }).click();
    await expect(page).toHaveURL(/\/photography\/14$/);
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/\/photography\/15$/);
    await expect(page.locator('.photo-caption time')).toHaveText('January 2, 2026');
    await expect(page.getByRole('button', { name: 'Next photograph' })).toBeDisabled();
    await page.keyboard.press('ArrowLeft');
    await expect(page).toHaveURL(/\/photography\/14$/);
    await expect(page.locator('.photo-caption')).toContainText('Paris, France');
  });

  test('vertical keys and Escape retain their navigation behavior', async ({ page }) => {
    // Establish client navigation before sending window keys: SSR controls can
    // appear before hydration, and window key events cannot be replayed.
    await page.goto('/photography/15');
    await page.getByRole('button', { name: 'Previous photograph' }).click();
    await expect(page).toHaveURL(/\/photography\/14$/);
    await page.keyboard.press('ArrowDown');
    await expect(page).toHaveURL(/\/photography\/15$/);
    await page.keyboard.press('ArrowUp');
    await expect(page).toHaveURL(/\/photography\/14$/);
    await page.keyboard.press('Escape');
    await expect(page).toHaveURL(/\/photography$/);
  });

  test('photo buttons work without View Transitions and browser Back restores the photo', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(document, 'startViewTransition', { configurable: true, value: undefined });
    });
    await page.goto('/photography/14');
    await page.getByRole('button', { name: 'Next photograph' }).click();
    await expect(page).toHaveURL(/\/photography\/15$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/photography\/14$/);
    await expect(page.locator('.photo-caption')).toContainText('Paris, France');
  });
});

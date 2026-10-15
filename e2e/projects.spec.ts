import { expect, test } from '@playwright/test';

test.describe('flagship lab projects', () => {
  test('Prognosis 2100 renders and its toggle is interactive', async ({ page }) => {
    await page.goto('/lab/prognosis-2100');

    await expect(page).toHaveTitle(/Prognosis 2100/i);
    await expect(page.getByRole('heading', { level: 1, name: /prognosis 2100/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /back to lab/i })).toBeVisible();

    const toggle = page.getByRole('checkbox', { name: /show prognosis/i });
    await expect(toggle).not.toBeChecked();
    await toggle.setChecked(true, { force: true });
    await expect(toggle).toBeChecked();
    await page.getByRole('link', { name: /back to lab/i }).click();
    await expect(page).toHaveURL(/\/lab$/);
  });

  test('Ons Land renders its explainer content', async ({ page }) => {
    await page.goto('/lab/ons-land');

    await expect(page).toHaveTitle(/Ons Land/i);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /land use in the netherlands/i
      })
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /technology/i })).toBeVisible();
    const chart = page.locator('.land-use-chart');
    const before = await chart.boundingBox();
    await expect(chart.locator('.hexagon').first()).toBeVisible({ timeout: 20_000 });
    const after = await chart.boundingBox();
    expect(Math.abs(after!.height - before!.height)).toBeLessThan(1);
  });

  test('generative art gallery exposes project navigation', async ({ page }) => {
    await page.goto('/lab/gen-art-gallery');

    await expect(page).toHaveTitle(/Generative Art Gallery/i);
    await expect(page.getByRole('link', { name: /back to lab/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /next/i })).toBeVisible();
    await page.getByRole('button', { name: /next/i }).click();
    await expect(page.getByRole('heading', { name: 'Tetris Time' })).toBeVisible();
    await expect(page.locator('iframe[title="Tetris Time"]')).toBeVisible();
    await expect(page.getByRole('link', { name: /open in new tab/i }).first()).toBeVisible();
  });
});

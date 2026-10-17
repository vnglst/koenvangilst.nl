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

  test('Ons Land renders its map and supports category selection and clearing', async ({ page }) => {
    await page.goto('/lab/ons-land');

    await expect(page).toHaveTitle(/Ons Land/i);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /land use in the netherlands/i
      })
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /technology/i })).toBeVisible();
    const chart = page.locator('.land-use-chart:has(svg)');
    await expect(chart).toBeVisible();
    const before = await chart.evaluate((element) => element.getBoundingClientRect().height);
    await expect(chart.locator('.hexagon').first()).toBeVisible({ timeout: 20_000 });
    const after = await chart.evaluate((element) => element.getBoundingClientRect().height);
    expect(before).toBeGreaterThan(0);
    expect(Math.abs(after - before)).toBeLessThan(1);
    await chart.locator('.hexagon').first().click();
    const dimmedCategories = chart.locator('.legend-item[opacity="0.4"]');
    await expect.poll(() => dimmedCategories.count()).toBeGreaterThan(0);
    await page.mouse.move(0, 0);
    await expect.poll(() => dimmedCategories.count()).toBeGreaterThan(0);
    await page.getByRole('heading', { level: 1 }).click();
    await expect(dimmedCategories).toHaveCount(0);
    await expect(chart.locator('.hexagon[stroke-width="1"]')).toHaveCount(0);
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

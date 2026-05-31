import { expect, test } from '@playwright/test';

test.describe('prognosis 2100 charts', () => {
  test('charts render with prognosis toggle off', async ({ page }) => {
    await page.goto('/lab/prognosis-2100');

    await expect(page.getByRole('heading', { level: 1, name: /prognosis 2100/i })).toBeVisible();

    const chartContainers = page.locator('[_echarts_instance_]');
    await expect(chartContainers.first()).toBeVisible({ timeout: 10_000 });

    const chartCount = await chartContainers.count();
    expect(chartCount).toBeGreaterThan(0);
  });

  test('charts render with prognosis toggle on', async ({ page }) => {
    await page.goto('/lab/prognosis-2100');

    const toggle = page.getByRole('checkbox', { name: /show prognosis/i });
    await toggle.setChecked(true, { force: true });
    await expect(toggle).toBeChecked();

    const chartContainers = page.locator('[_echarts_instance_]');
    await expect(chartContainers.first()).toBeVisible({ timeout: 10_000 });

    const chartCount = await chartContainers.count();
    expect(chartCount).toBeGreaterThan(0);
  });
});

test.describe('project browser search', () => {
  test('filters articles by tag query', async ({ page }) => {
    await page.goto('/lab?q=article');

    await expect(page).toHaveURL(/\/lab\?q=article$/);
    await expect(page.locator('main a[href^="/lab/"]').first()).toBeVisible();
  });

  test('handles special regex characters without crashing', async ({ page }) => {
    await page.goto('/lab?q=[test');

    await expect(page.getByText('Nothing found.')).toBeVisible();
  });
});

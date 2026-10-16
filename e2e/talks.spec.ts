import { expect, test } from '@playwright/test';

for (const width of [320, 1440]) {
  test(`talks are readable and reachable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/lab');
    if (width < 768) await page.getByRole('button', { name: 'Open navigation' }).click();
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Talks', exact: true })
      .click();
    await expect(page).toHaveURL(/\/talks$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Talks', exact: true })).toBeVisible();
    await expect(page.locator('.talk-entry')).toHaveCount(4);
    await expect(page.locator('.talk-entry a')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'The Future of Software Engineering' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });
}

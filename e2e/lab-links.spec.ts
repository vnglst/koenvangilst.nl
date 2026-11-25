import { expect, test } from '@playwright/test';

test('Articles hover underlines only the article title', async ({ page }) => {
  await page.goto('/articles');
  const entry = page.locator('.post-link').first();
  await entry.hover();
  await expect(entry).toHaveCSS('text-decoration-line', 'none');
  await expect(entry.locator('.post-title')).toHaveCSS('text-decoration-line', 'underline');
  await expect(entry.locator('time')).toHaveCSS('text-decoration-line', 'none');
});

test('the section label above an article leads to Articles', async ({ page }) => {
  await page.goto('/articles/code-doesnt-speak-for-itself');
  const section = page.locator('main .section-link');
  await expect(section).toHaveText('Articles');
  await expect(section).toHaveCSS('text-transform', 'uppercase');
  expect((await section.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await section.click();
  await expect(page).toHaveURL(/\/articles$/);
});

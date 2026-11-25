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

test('each article ends with a quiet link to the next older article', async ({ page }) => {
  await page.goto('/articles');
  const entries = page.locator('main .post-link');
  const [first, second] = [entries.nth(0), entries.nth(1)];
  const secondTitle = (await second.locator('.post-title').textContent())!;
  await first.click();
  const next = page.getByRole('navigation', { name: 'Next article' }).getByRole('link');
  await expect(next).toContainText('Next article');
  await expect(next).toContainText(secondTitle);
  await expect(next).toHaveCSS('text-decoration-line', 'none');
  await next.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(secondTitle);

  await page.goto('/articles');
  await entries.last().click();
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.getByRole('navigation', { name: 'Next article' })).toHaveCount(0);
});

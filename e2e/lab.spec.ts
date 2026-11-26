import { expect, test } from '@playwright/test';

test.describe('articles', () => {
  test('article listing filters content and opens an article plus its tag page', async ({ page }) => {
    await page.goto('/articles?q=article');

    await expect(page.getByRole('heading', { level: 1, name: 'Articles' })).toBeVisible();
    await expect(page).toHaveURL(/\/articles\?q=article$/);

    const firstInternalArticleLink = page
      .locator('main a[href^="/articles/"]')
      .filter({ has: page.locator('article') })
      .first();

    await expect(firstInternalArticleLink).toBeVisible();
    await firstInternalArticleLink.click();

    await expect(page).toHaveURL(/\/articles\/[^/?#]+$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const firstTagLink = page.locator('a[href^="/tag/"]').first();
    await expect(firstTagLink).toBeVisible();
    await firstTagLink.click();

    await expect(page).toHaveURL(/\/tag\/[^/?#]+$/);
    await expect(page.getByRole('heading', { name: /posts about/i })).toBeVisible();
  });
});

test('Lab lists dated projects by year and links to them directly', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/lab');
  await expect(page.getByRole('heading', { level: 1, name: 'Lab' })).toBeVisible();
  await expect(page.locator('.archive-year').first()).toBeVisible();
  await expect(page.locator('a.post-link[href="https://captainslog.koenvangilst.nl/"] time')).toBeVisible();
});

test('former Lab filter links move to Articles or the Lab', async ({ page }) => {
  await page.goto('/lab?q=snippet');
  await expect(page).toHaveURL(/\/articles\?q=snippet$/);
  await page.goto('/lab?q=side-project');
  await expect(page).toHaveURL(/\/lab$/);
});

test('Side projects includes projects mentioned in articles and every gallery destination once', async ({ page }) => {
  await page.goto('/lab');
  const links = page.locator('main a.post-link');
  for (const name of [
    'Tetris Time',
    'Pong Wars',
    'Time Flies',
    'Caffeine',
    'Pomodori',
    'React Canvas',
    'Pelican Gallery'
  ]) {
    await expect(links.filter({ has: page.locator('.post-title', { hasText: new RegExp(`^${name}$`) }) })).toHaveCount(
      1
    );
  }
  const destinations = await links.evaluateAll((elements) =>
    elements.map((element) => {
      const url = new URL((element as HTMLAnchorElement).href);
      return `${url.origin}${url.pathname.replace(/\/$/, '')}`;
    })
  );
  expect(new Set(destinations).size).toBe(destinations.length);
});

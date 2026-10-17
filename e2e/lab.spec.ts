import { expect, test } from '@playwright/test';

test.describe('lab and blog content', () => {
  test('lab listing filters content and opens an article plus its tag page', async ({ page }) => {
    await page.goto('/lab?q=article');

    await expect(page.getByRole('heading', { level: 1, name: /articles & experiments/i })).toBeVisible();
    await expect(page).toHaveURL(/\/lab\?q=article$/);

    const firstInternalArticleLink = page
      .locator('main a[href^="/lab/"]')
      .filter({ has: page.locator('article') })
      .first();

    await expect(firstInternalArticleLink).toBeVisible();
    await firstInternalArticleLink.click();

    await expect(page).toHaveURL(/\/lab\/[^/?#]+$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const firstTagLink = page.locator('a[href^="/tag/"]').first();
    await expect(firstTagLink).toBeVisible();
    await firstTagLink.click();

    await expect(page).toHaveURL(/\/tag\/[^/?#]+$/);
    await expect(page.getByRole('heading', { name: /posts about/i })).toBeVisible();
  });
});

test('Lab category controls filter entries, restore with Back, and clear the URL', async ({ page }) => {
  await page.goto('/lab');
  const entries = page.locator('.post-link');
  const total = await entries.count();
  expect(total).toBeGreaterThan(0);
  const snippets = page.getByRole('button', { name: 'snippets', exact: true });
  await snippets.click();
  await expect(page).toHaveURL(/\/lab\?q=snippet$/);
  await expect(snippets).toHaveAttribute('aria-pressed', 'true');
  expect(await entries.count()).toBeGreaterThan(0);
  expect(await entries.count()).toBeLessThan(total);
  await page.goBack();
  await expect(page.getByRole('button', { name: 'All', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(entries).toHaveCount(total);
  await snippets.click();
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page).toHaveURL(/\/lab$/);
  await expect(entries).toHaveCount(total);
});

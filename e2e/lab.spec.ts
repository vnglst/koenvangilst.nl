import { expect, test } from '@playwright/test';

const LEGACY_ARTICLE_SLUG = 'clean-code-is-a-phase';

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

  test('legacy blog routes redirect to the TanStack lab routes', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveURL('/lab');
    await expect(page.getByRole('heading', { level: 1, name: /articles & experiments/i })).toBeVisible();

    await page.goto(`/blog/${LEGACY_ARTICLE_SLUG}`);
    await expect(page).toHaveURL(`/lab/${LEGACY_ARTICLE_SLUG}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

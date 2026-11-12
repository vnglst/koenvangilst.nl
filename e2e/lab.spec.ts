import { expect, test } from '@playwright/test';

test.describe('lab and blog content', () => {
  test('lab listing filters content and opens an article plus its tag page', async ({ page }) => {
    await page.goto('/lab?q=article');

    await expect(page.getByRole('heading', { level: 1, name: /articles & side projects/i })).toBeVisible();
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

test('Lab switches to direct project links and restores all articles on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/lab?q=snippet');
  await expect(page.locator('.post-title').filter({ hasText: 'My gitconfig' })).toBeVisible();
  await page.getByRole('button', { name: 'All articles', exact: true }).click();
  await expect(page).toHaveURL(/\/lab$/);
  const total = await page.locator('.post-link').count();
  await page.getByRole('button', { name: 'Side projects', exact: true }).click();
  await expect(page).toHaveURL(/q=side-project/);
  await expect(page.locator('.side-project-list a[href="https://captainslog.koenvangilst.nl/"]')).toBeVisible();
  await expect(page.locator('.post-link')).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Side projects', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await page.getByRole('button', { name: 'All articles', exact: true }).click();
  await expect(page.locator('.post-link')).toHaveCount(total);
  await page.goBack();
  await expect(page.locator('.side-project-list')).toBeVisible();
});

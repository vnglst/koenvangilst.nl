import { expect, test } from '@playwright/test';

test.describe('Open Graph metadata', () => {
  test('uses a content-addressed home image URL', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /^https:\/\/koenvangilst\.nl\/og\/home-[a-f0-9]{12}\.png$/
    );
  });

  test('uses content-addressed post and tag image URLs', async ({ page }) => {
    await page.goto('/lab/progressively-enhanced-dark-mode');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /^https:\/\/koenvangilst\.nl\/og\/progressively-enhanced-dark-mode-[a-f0-9]{12}\.png$/
    );

    await page.goto('/tag/dark-mode');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /^https:\/\/koenvangilst\.nl\/og\/tag-dark-mode-[a-f0-9]{12}\.png$/
    );
  });
});

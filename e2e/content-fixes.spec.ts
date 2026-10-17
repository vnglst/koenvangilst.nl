import { expect, test } from '@playwright/test';

test('code-only gitconfig post renders the original code', async ({ page }) => {
  await page.goto('/lab/gitconfig');
  await expect(page.locator('.article-body pre')).toContainText('[alias]');
  await expect(page.locator('.article-body pre')).toContainText('autoSetupRemote = true');
  await expect(page.getByRole('button', { name: 'Copy code' })).toBeVisible();
});

for (const width of [390, 1440]) {
  test(`article widths agree across posts and removed covers stay absent at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    let readingWidth: number | undefined;
    for (const slug of [
      'trunkbased-development',
      'plantbased-diet',
      'code-doesnt-speak-for-itself',
      'two-uncomfortably-exciting-conference-talks'
    ]) {
      await page.goto(`/lab/${slug}`);
      await expect(page.locator('.article-body')).not.toBeEmpty();
      const body = await page.locator('.article-body').boundingBox();
      const header = await page.locator('.page-header').boundingBox();
      const paragraph = await page.locator('.article-body > p').first().boundingBox();
      readingWidth ??= body!.width;
      expect(body!.width).toBe(readingWidth);
      expect(header!.width).toBe(readingWidth);
      expect(paragraph!.width).toBe(readingWidth);
      if (slug === 'trunkbased-development' || slug === 'plantbased-diet')
        await expect(page.locator('.article-cover')).toHaveCount(0);
    }
  });

  test(`Time Flies stays an external embed at ${width}px`, async ({ page }) => {
    await page.route('https://time-flies.koenvangilst.nl/**', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<html><body>Time Flies</body></html>' })
    );
    await page.goto('/lab/gen-art-gallery?project=time-flies');
    await expect(page.locator('iframe')).toHaveAttribute('src', 'https://time-flies.koenvangilst.nl');
    await expect(page.getByRole('link', { name: /open in new tab/i })).toHaveAttribute(
      'href',
      'https://time-flies.koenvangilst.nl'
    );
  });
}

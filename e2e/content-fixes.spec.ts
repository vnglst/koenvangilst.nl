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

  test(`Time Flies fits its frame with no inner scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/lab/gen-art-gallery?project=time-flies');
    const artwork = page.frameLocator('iframe');
    await expect(artwork.locator('canvas')).toBeVisible();
    expect(
      await artwork.locator('html').evaluate((el) => ({
        vertical: el.scrollHeight > el.clientHeight,
        horizontal: el.scrollWidth > el.clientWidth
      }))
    ).toEqual({ vertical: false, horizontal: false });
    const credits = await artwork.locator('#made').boundingBox();
    const frame = await page.locator('iframe').boundingBox();
    expect(credits!.y + credits!.height).toBeLessThanOrEqual(frame!.y + frame!.height);
  });
}

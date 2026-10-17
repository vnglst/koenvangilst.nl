import { expect, test } from '@playwright/test';

const posts = [
  'two-uncomfortably-exciting-conference-talks',
  'code-doesnt-speak-for-itself',
  'tetris-time',
  'gpt-6-astra-the-scream',
  'react-hooks-with-canvas',
  'european-land-use',
  'phoenix-liveview-cursors'
];

for (const width of [390, 1440]) {
  test(`mixed article content stays readable at ${width}px`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 1000 });
    for (const slug of posts) {
      await page.goto(`/lab/${slug}`);
      const body = page.locator('.article-body');
      await expect(body).not.toBeEmpty();
      for (const theme of ['dark', 'light']) {
        const dark = (await page.locator('html').getAttribute('class'))?.includes('dark');
        if (dark !== (theme === 'dark')) await page.getByRole('button', { name: /switch to .* mode/i }).click();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${slug} ${theme}`).toBe(
          true
        );
        const paragraph = body.locator(':scope > p').first();
        if (await paragraph.count()) {
          const text = await paragraph.boundingBox();
          const column = await body.boundingBox();
          expect(text!.width).toBeLessThanOrEqual(column!.width + 1);
          expect(Math.abs(text!.width - column!.width)).toBeLessThan(1);
        }
      }
    }
  });
}

test('cover dimensions and caption spacing preserve the article rhythm', async ({ page }) => {
  await page.goto('/lab/two-uncomfortably-exciting-conference-talks');
  const cover = page.locator('.article-cover');
  await expect(cover).toHaveAttribute('loading', 'eager');
  await expect(cover).toHaveAttribute('width', '2048');
  await expect(cover).toHaveAttribute('height', '1413');
  await expect(cover).toHaveCSS('margin-bottom', '40px');
  await expect(page.locator('.article-metadata time')).toHaveAttribute('datetime', '2026-10-10');
  await page.goto('/lab/tetris-time');
  const figure = page.locator('.article-body figure');
  await expect(figure.locator('figcaption')).toBeVisible();
  await expect(figure).toHaveCSS('margin-bottom', '32px');
});

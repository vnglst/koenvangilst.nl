import { expect, test } from '@playwright/test';

for (const width of [320, 768, 1440, 1920]) {
  test(`shared typography and layout fit both themes at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      '/',
      '/lab',
      '/talks',
      '/lab/two-uncomfortably-exciting-conference-talks',
      '/photography',
      '/lab/gen-art-gallery'
    ]) {
      await page.goto(path);
      const title = page.locator('main h1');
      await expect(title).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await expect(title).toHaveCSS('font-weight', '700');
      await expect(title).toHaveCSS('font-size', width === 320 ? '25px' : width < 768 ? '28px' : '32px');
      expect(await title.evaluate((el) => getComputedStyle(el).fontFamily)).toContain('Nimbus');
      for (const theme of ['light', 'dark']) {
        const dark = (await page.locator('html').getAttribute('class'))?.includes('dark');
        if (dark !== (theme === 'dark')) await page.getByRole('button', { name: /switch to .* mode/i }).click();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), path).toBe(true);
        expect((await page.locator('.site-main').boundingBox())!.width).toBeLessThanOrEqual(640);
      }
    }
    await page.goto('/lab/code-doesnt-speak-for-itself');
    await expect(page.locator('.article-body')).toHaveCSS('font-size', '17px');
    await expect(page.locator('.article-body')).toHaveCSS('line-height', '28px');
    await page.goto('/lab/aranet4-co2-monitor');
    await expect(page.getByRole('heading', { name: 'Requirements', exact: true })).toHaveCSS('font-size', '22px');
  });
}

test('Lab has category filters without a search field', async ({ page }) => {
  await page.goto('/lab');
  await expect(page.getByRole('searchbox')).toHaveCount(0);
  await page.getByRole('button', { name: 'snippets', exact: true }).click();
  await expect(page).toHaveURL(/q=snippet/);
  await expect(page.locator('.post-title').filter({ hasText: 'My gitconfig' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'snippets', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('.post-link').first()).toBeVisible();
});

test('photography preserves natural proportions and staggered columns with aligned theme controls', async ({
  page
}) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/photography');
    const grid = page.locator('.photo-grid');
    await expect(grid).toBeVisible();
    const boxes = await grid.locator('button').evaluateAll((elements) =>
      elements.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      })
    );
    if (width < 768) {
      expect(boxes[1].x).toBe(boxes[0].x);
      expect(boxes[1].y).toBeGreaterThan(boxes[0].y + boxes[0].height);
    } else {
      expect(boxes[0].width / boxes[1].width).toBeCloseTo(1.4, 1);
      expect(boxes[1].y - boxes[0].y).toBeCloseTo(120, 0);
    }
    const image = grid.locator('img').first();
    const dimensions = await image.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return {
        rendered: r.width / r.height,
        original: Number(el.getAttribute('width')) / Number(el.getAttribute('height'))
      };
    });
    expect(dimensions.rendered).toBeCloseTo(dimensions.original, 2);
    await expect(grid.locator('figcaption').first()).not.toBeEmpty();
    if (width >= 768) {
      const icon = page.locator('.theme-toggle svg');
      await expect(icon).toBeVisible();
      const iconBox = await icon.boundingBox();
      const label = await page.locator('#main-navigation a').first().boundingBox();
      expect(Math.abs(iconBox!.x - label!.x)).toBeLessThan(1);
    }
  }
});

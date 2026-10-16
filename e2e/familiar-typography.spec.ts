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

test('photography uses a regular square grid and the desktop theme icon aligns with navigation', async ({ page }) => {
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
    const columns = width < 640 ? 1 : width < 1024 ? 2 : 3;
    expect(boxes.slice(0, columns).every((box) => box.y === boxes[0].y)).toBe(true);
    expect(Math.abs(boxes[0].width - boxes[0].height)).toBeLessThan(1);
    await expect(grid.locator('img').first()).toHaveCSS('object-fit', 'cover');
    if (width >= 768) {
      const icon = page.locator('.theme-toggle svg');
      await expect(icon).toBeVisible();
      const iconBox = await icon.boundingBox();
      const label = await page.locator('#main-navigation a').first().boundingBox();
      expect(Math.abs(iconBox!.x - label!.x)).toBeLessThan(1);
    }
  }
});

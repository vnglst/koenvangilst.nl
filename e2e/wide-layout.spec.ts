import { expect, test } from '@playwright/test';

for (const width of [1100, 1440, 1920, 2560, 3440]) {
  test(`desktop pages share a bounded composition at ${width}px`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 1440 });
    let contentLeft: number | undefined;
    let headingSize: number | undefined;
    let railLeft: number | undefined;
    let railTop: number | undefined;
    for (const path of [
      '/lab',
      '/lab/code-doesnt-speak-for-itself',
      '/tag/stoicism',
      '/photography',
      '/lab/gen-art-gallery',
      '/lab/ons-land',
      '/lab/prognosis-2100',
      '/'
    ]) {
      await page.goto(path);
      await expect(page.locator('main h1')).toHaveCount(1);
      await page.evaluate(() => document.fonts.ready);
      const geometry = await page.evaluate(() => {
        const main = document.querySelector('.site-main')!.getBoundingClientRect();
        const signature = document.querySelector('.site-colophon')!.getBoundingClientRect();
        const frame = document.querySelector('.site-shell')!.getBoundingClientRect();
        return {
          left: main.left,
          top: main.top,
          width: main.width,
          gap: main.left - signature.right,
          gutter: signature.left,
          railTop: signature.top,
          right: main.right,
          clientWidth: document.documentElement.clientWidth,
          rightGutter: innerWidth - frame.right + 40,
          heading: parseFloat(getComputedStyle(document.querySelector('main h1')!).fontSize),
          overflow: document.documentElement.scrollWidth > innerWidth
        };
      });
      railLeft ??= geometry.gutter;
      railTop ??= geometry.railTop;
      expect(Math.abs(geometry.gutter - railLeft), `${path}: sidebar left`).toBeLessThan(1);
      expect(Math.abs(geometry.railTop - railTop), `${path}: sidebar top`).toBeLessThan(1);
      if (path === '/photography') {
        expect(Math.abs(geometry.left - contentLeft!)).toBeLessThan(1);
        expect(geometry.clientWidth - geometry.right).toBeCloseTo(Math.min(64, Math.max(32, width * 0.03)), 0);
        expect(geometry.gap).toBe(64);
        expect(geometry.overflow).toBe(false);
        expect(geometry.heading).toBe(32);
        continue;
      }
      contentLeft ??= geometry.left;
      headingSize ??= geometry.heading;
      expect(Math.abs(geometry.left - contentLeft), path).toBeLessThan(1);
      expect(geometry.gap, path).toBeGreaterThanOrEqual(48);
      expect(geometry.gap, path).toBeLessThanOrEqual(120);
      expect(Math.abs(geometry.gutter - geometry.rightGutter), path).toBeLessThan(1);
      expect(geometry.overflow, path).toBe(false);
      if (path === '/') {
        expect(geometry.width).toBeLessThanOrEqual(640);
        expect(geometry.top).toBeLessThanOrEqual(240);
      } else {
        expect(geometry.top, path).toBe(width >= 1700 ? 128 : 112);
        expect(Math.abs(geometry.heading - headingSize), path).toBeLessThan(0.1);
      }
      if (['/lab', '/lab/code-doesnt-speak-for-itself', '/tag/stoicism'].includes(path))
        expect(geometry.width, path).toBeLessThanOrEqual(640);
      if (width >= 1920) expect(geometry.left - geometry.gutter, path).toBeLessThanOrEqual(416);
    }
  });
}

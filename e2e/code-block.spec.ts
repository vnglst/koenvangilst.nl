import { expect, test } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`single-line code stays compact at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/lab/captains-log');
    const block = page.locator('.code-block').first();
    const pre = block.locator('pre');
    const copy = block.getByRole('button', { name: 'Copy code' });
    await expect(block).toBeVisible();
    const bounds = (await block.boundingBox())!;
    expect(bounds.height).toBeLessThanOrEqual(72);
    const codeBounds = (await pre.boundingBox())!;
    const copyBounds = (await copy.boundingBox())!;
    expect(codeBounds.x + codeBounds.width).toBeLessThanOrEqual(copyBounds.x);
    await copy.click();
    await expect(copy).toHaveText(/Copied|Copy failed/);
    expect((await block.boundingBox())!.height).toBe(bounds.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

import { expect, test } from '@playwright/test';

function luminance(color: string) {
  const channels = color
    .match(/[\d.]+/g)!
    .slice(0, 3)
    .map(Number)
    .map((value) => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

for (const width of [320, 1440]) {
  test(`light theme has strong secondary text and clear controls at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => localStorage.setItem('theme', 'light'));
    await page.goto('/lab');
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    const canvas = await page.locator('body').evaluate((el) => getComputedStyle(el).backgroundColor);
    for (const selector of ['.post-entry p', '.post-entry time', '.archive-year', '.site-footer', '.theme-toggle']) {
      const color = await page
        .locator(selector)
        .first()
        .evaluate((el) => getComputedStyle(el).color);
      expect(contrast(color, canvas), selector).toBeGreaterThanOrEqual(7);
    }
    const selected = await page
      .getByRole('button', { name: 'All', exact: true })
      .evaluate((el) => getComputedStyle(el).color);
    expect(contrast(selected, canvas)).toBeGreaterThanOrEqual(5.5);
    await page.goto('/design-system');
    const primary = page.locator('.editorial-button-primary').first();
    const colors = await primary.evaluate((el) => ({
      foreground: getComputedStyle(el).color,
      background: getComputedStyle(el).backgroundColor
    }));
    expect(contrast(colors.foreground, colors.background)).toBeGreaterThanOrEqual(5.5);
    const border = await page
      .locator('.editorial-button-outline')
      .first()
      .evaluate((el) => getComputedStyle(el).borderTopColor);
    expect(contrast(border, canvas)).toBeGreaterThanOrEqual(3);
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(2, 6, 23)');
    await expect(page.locator('.ds-caption').first()).toHaveCSS('color', 'rgb(156, 163, 175)');
  });
}

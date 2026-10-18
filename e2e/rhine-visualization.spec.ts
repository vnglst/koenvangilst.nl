import { expect, test } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`Rhine controls keep both charts synchronized at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/lab/rhine-highs-and-lows');

    const visual = page.getByRole('region', { name: 'The Rhine at Lobith through time' });
    const year = visual.getByRole('slider', { name: 'Year', exact: true });
    await year.scrollIntoViewIfNeeded();
    await expect(year).toHaveAttribute('aria-valuetext', '2026');
    await expect(visual.getByRole('button', { name: 'Play', exact: true })).toBeVisible();

    await visual.getByRole('button', { name: 'Front view', exact: true }).click();
    await expect(visual.getByRole('button', { name: 'Front view', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await year.press('Home');
    await year.press('ArrowRight');
    await expect(year).toHaveAttribute('aria-valuetext', '1902');
    await expect(visual.getByRole('img')).toHaveAttribute('aria-label', /through 1902$/);
    await expect(visual.getByText(/Water level:/)).toHaveCount(0);

    await visual.getByText('Compare water level', { exact: true }).click();
    await expect(visual.getByRole('img')).toHaveCount(2);
    for (const chart of await visual.getByRole('img').all()) {
      await expect(chart).toHaveAttribute('aria-label', /through 1902$/);
    }
    await expect(visual.getByText(/Water level:/)).toBeVisible();
    await visual.getByRole('button', { name: 'Landscape', exact: true }).click();
    await expect(visual.getByRole('button', { name: 'Landscape', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await visual.getByRole('combobox', { name: 'Playback speed', exact: true }).selectOption('4');
    await expect(visual.getByRole('combobox', { name: 'Playback speed', exact: true })).toHaveValue('4');

    await visual.getByText('Axes and color key', { exact: true }).click();
    await expect(visual.getByText('Below average')).toHaveCount(0);
    await visual.getByText('Axes and color key', { exact: true }).click();
    await expect(visual.getByText('Compared with the same time of year')).toBeVisible();

    await expect(visual.locator('[class*="touch-pan-y"]')).toHaveCSS('touch-action', 'pan-y');
    for (const theme of ['light', 'dark']) {
      const isDark = (await page.locator('html').getAttribute('class'))?.includes('dark');
      if (isDark !== (theme === 'dark')) await page.getByRole('button', { name: /switch to .* mode/i }).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      for (const button of await visual.getByRole('button').all()) {
        expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      }
    }
    await visual.getByText('Compare water level', { exact: true }).click();
    await year.press('End');
    await year.scrollIntoViewIfNeeded();
    await visual.screenshot({ path: `output/rhine-refined-${width}.png` });
  });
}

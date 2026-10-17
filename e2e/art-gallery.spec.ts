import { expect, test } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`project browsing preserves selection and keeps controls above the artwork at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.route(/^https:\/\/[^/]+\.koenvangilst\.nl/, (route) =>
      route.fulfill({ contentType: 'text/html', body: '<html><body>Artwork</body></html>' })
    );
    await page.goto('/lab/gen-art-gallery');
    const picker = page.getByRole('combobox', { name: 'Choose an art project' });
    const next = page.getByRole('button', { name: 'Next art project' });
    const previous = page.getByRole('button', { name: 'Previous art project' });
    await expect(previous).toBeDisabled();
    await expect(picker.locator('option')).toHaveCount(10);
    await next.click();
    await expect(picker).toHaveValue('tetris-time');
    await expect(page).toHaveURL(/project=tetris-time/);
    await page.reload();
    await expect(picker).toHaveValue('tetris-time');
    await picker.selectOption('rock-paper-scissors');
    await expect(next).toBeDisabled();
    await expect(page.locator('iframe')).toHaveAttribute('title', 'Rock Paper Scissors');
    await page.goBack();
    await expect(picker).toHaveValue('tetris-time');
    await previous.press('ArrowRight');
    await expect(picker).toHaveValue('voronoi-virus');
    await expect(page.locator('.art-loading')).toHaveCount(0);
    const controls = await page.getByRole('navigation', { name: 'Art projects' }).boundingBox();
    const canvas = await page.locator('iframe').boundingBox();
    expect(controls!.y + controls!.height).toBeLessThanOrEqual(canvas!.y);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('link', { name: /open in new tab/i })).toHaveAttribute(
      'href',
      'https://voronoi-virus.koenvangilst.nl'
    );
  });
}

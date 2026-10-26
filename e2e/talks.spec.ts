import { expect, test } from '@playwright/test';

for (const width of [320, 1440]) {
  test(`talks are readable and reachable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/lab');
    if (width < 768) await page.getByRole('button', { name: 'Open navigation' }).click();
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Talks', exact: true })
      .click();
    await expect(page).toHaveURL(/\/talks$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Talks', exact: true })).toBeVisible();
    const photo = page.getByRole('img', { name: /Frontmania.*Tetris/i });
    await expect(photo).toBeVisible();
    await expect(photo).toHaveAttribute('src', '/static/images/frontmania-2026-tetris.jpg');
    await expect.poll(() => photo.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
    const imageBounds = (await photo.boundingBox())!;
    const column = (await page.locator('.site-main').boundingBox())!;
    expect(Math.abs(imageBounds.width - column.width)).toBeLessThan(1);
    expect(Math.abs(imageBounds.width / imageBounds.height - 2048 / 1413)).toBeLessThan(0.01);
    await expect(page.locator('.talk-entry')).toHaveCount(4);
    const recap = page.getByRole('link', { name: 'Read the conference recap' });
    await expect(recap).toHaveAttribute('href', '/lab/two-uncomfortably-exciting-conference-talks');
    await expect(page.getByRole('heading', { name: 'The Future of Software Engineering' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await recap.click();
    await expect(
      page.getByRole('heading', { level: 1, name: 'Two Uncomfortably Exciting Conference Talks' })
    ).toBeVisible();
  });
}

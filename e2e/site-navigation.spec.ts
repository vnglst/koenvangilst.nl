import { expect, test } from '@playwright/test';

test.describe('site shell', () => {
  test('homepage exposes the core navigation and recent articles', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Koen van Gilst/i);
    await expect(page.getByRole('heading', { level: 1, name: 'Koen van Gilst' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: /main navigation/i })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Lab' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Photography' })).toBeVisible();
    await expect(page.getByText('Recent articles')).toBeVisible();
    await expect(page.locator('main section ul li a').first()).toBeVisible();
  });

  test('unknown routes render the not found page', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist-ever');

    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: /404 - Not found/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /return home/i })).toBeVisible();
  });
});

for (const width of [390, 1440]) {
  test(`main navigation connects About, Lab, Photography and Talks at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('main')).toContainText("I'm a software engineer with a philosophy degree");
    await page.locator('.recent-entry a').first().click();
    await expect(page.locator('.article-body')).not.toBeEmpty();
    for (const [label, destination, heading] of [
      ['Lab', '/lab', 'Articles & Experiments'],
      ['Photography', '/photography', 'Photography'],
      ['Talks', '/talks', 'Talks'],
      ['About', '/', 'Koen van Gilst']
    ]) {
      if (width < 768) await page.getByRole('button', { name: 'Open navigation' }).click();
      const navigation = page.getByRole('navigation', { name: 'Main navigation', includeHidden: true });
      await navigation.getByRole('link', { name: label, exact: true }).click();
      await expect(page).toHaveURL(new URL(destination, page.url()).href);
      await expect(page.getByRole('heading', { level: 1, name: heading, exact: true })).toBeVisible();
      await expect(navigation.locator(`a[href="${destination}"]`)).toHaveAttribute('aria-current', 'page');
      if (width < 768) await expect(navigation).toBeHidden();
    }
  });
}

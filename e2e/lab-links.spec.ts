import { expect, test } from '@playwright/test';

test('Lab hover underlines only the article title', async ({ page }) => {
  await page.goto('/lab');
  const entry = page.locator('.post-link').first();
  await entry.hover();
  await expect(entry).toHaveCSS('text-decoration-line', 'none');
  await expect(entry.locator('.post-title')).toHaveCSS('text-decoration-line', 'underline');
  await expect(entry.locator('time')).toHaveCSS('text-decoration-line', 'none');
});

test('Back to Lab hover underlines its label without the arrow', async ({ page }) => {
  await page.goto('/lab/code-doesnt-speak-for-itself');
  const back = page.getByRole('link', { name: 'Back to Lab', exact: true });
  await back.hover();
  await expect(back).toHaveCSS('text-decoration-line', 'none');
  await expect(back.locator('[aria-hidden]')).toHaveCSS('text-decoration-line', 'none');
  await expect(back.locator('.page-back-label')).toHaveCSS('text-decoration-line', 'underline');
  await back.click();
  await expect(page).toHaveURL(/\/lab$/);
});

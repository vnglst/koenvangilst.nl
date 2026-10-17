import { expect, test } from '@playwright/test';

test.describe('photography', () => {
  test('collection loads with natural image proportions', async ({ page }) => {
    await page.goto('/photography');
    await expect(page).toHaveTitle(/Photography/i);
    await expect(page.getByRole('heading', { name: 'Photography', exact: true })).toBeVisible();
    const image = page.locator('.photo-grid img').first();
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('width', '640');
    await expect(image).toHaveAttribute('height', '480');
  });

  test('photo deep links render the selected photograph and its full date on the server', async ({ page }) => {
    const response = await page.request.get('/photography/14');
    const html = await response.text();
    expect(html).toContain('Paris, France');
    expect(html).toContain('January 1, 2026');
    await page.goto('/photography/14');
    const caption = page.locator('.photo-caption');
    await expect(caption.getByText('Paris, France', { exact: true })).toBeVisible();
    await expect(caption.locator('time')).toHaveText('January 1, 2026');
    await expect(page.locator('.photo-slide img')).toHaveCount(1);
  });

  test('horizontal keys update the photo URL, caption, and boundary controls', async ({ page }) => {
    // Establish client navigation before sending window keys: SSR controls can
    // appear before hydration, and window key events cannot be replayed.
    await page.goto('/photography/15');
    await page.getByRole('button', { name: 'Previous photograph' }).click();
    await expect(page).toHaveURL(/\/photography\/14$/);
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/\/photography\/15$/);
    await expect(page.locator('.photo-caption time')).toHaveText('January 2, 2026');
    await expect(page.getByRole('button', { name: 'Next photograph' })).toBeDisabled();
    await page.keyboard.press('ArrowLeft');
    await expect(page).toHaveURL(/\/photography\/14$/);
    await expect(page.locator('.photo-caption')).toContainText('Paris, France');
  });

  test('vertical keys and Escape retain their navigation behavior', async ({ page }) => {
    // Establish client navigation before sending window keys: SSR controls can
    // appear before hydration, and window key events cannot be replayed.
    await page.goto('/photography/15');
    await page.getByRole('button', { name: 'Previous photograph' }).click();
    await expect(page).toHaveURL(/\/photography\/14$/);
    await page.keyboard.press('ArrowDown');
    await expect(page).toHaveURL(/\/photography\/15$/);
    await page.keyboard.press('ArrowUp');
    await expect(page).toHaveURL(/\/photography\/14$/);
    await page.keyboard.press('Escape');
    await expect(page).toHaveURL(/\/photography$/);
  });

  test('photo buttons work without View Transitions and browser Back restores the photo', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(document, 'startViewTransition', { configurable: true, value: undefined });
    });
    await page.goto('/photography/14');
    await page.getByRole('button', { name: 'Next photograph' }).click();
    await expect(page).toHaveURL(/\/photography\/15$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/photography\/14$/);
    await expect(page.locator('.photo-caption')).toContainText('Paris, France');
  });
});

test.describe('dates across time zones', () => {
  test.use({ timezoneId: 'America/Los_Angeles' });

  test('photo and article dates agree with server-rendered dates after hydration', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/photography/14');
    await page.getByRole('button', { name: 'Next photograph' }).click();
    await expect(page.locator('.photo-caption time')).toHaveText('January 2, 2026');
    await page.getByRole('button', { name: 'Previous photograph' }).click();
    await expect(page.locator('.photo-caption time')).toHaveText('January 1, 2026');
    await page.goto('/lab/two-uncomfortably-exciting-conference-talks');
    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    await expect(page.locator('.article-metadata time')).toHaveText('October 10, 2026');
    expect(errors).toEqual([]);
  });
});

test('mobile thumbnails open the viewer and swipe navigation returns to the collection', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/photography');
  await page.locator('.photo-grid button').first().click();
  await expect(page).toHaveURL(/\/photography\/13$/);
  await expect(page.getByRole('button', { name: 'Previous photograph' })).toBeDisabled();
  for (const [fromX, toX, id] of [
    [300, 100, 14],
    [100, 300, 13]
  ]) {
    await page.locator('.photo-slide').evaluate(
      (element, { fromX, toX }) => {
        const start = new Touch({ identifier: 1, target: element, clientX: fromX, clientY: 400 });
        const end = new Touch({ identifier: 1, target: element, clientX: toX, clientY: 400 });
        element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [start] }));
        element.dispatchEvent(new TouchEvent('touchend', { bubbles: true, changedTouches: [end] }));
      },
      { fromX, toX }
    );
    await expect(page).toHaveURL(new RegExp(`/photography/${id}$`));
  }
  await page.getByRole('button', { name: /Back/ }).click();
  await expect(page).toHaveURL(/\/photography$/);
  await expect(page.locator('.photo-grid button')).toHaveCount(3);
});

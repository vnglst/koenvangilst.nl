import { expect, test } from '@playwright/test';

test.describe('photography', () => {
  test('photography page loads with correct title', async ({ page }) => {
    await page.goto('/photography');

    await expect(page).toHaveTitle(/Photography/i);
  });

  test('fullscreen photo captions display a complete date below the location', async ({ page }) => {
    await page.goto('/photography/14');

    const activePhoto = page.locator('.photo-view-transition-target');
    await expect(activePhoto.getByText('Paris, France', { exact: true })).toBeVisible();
    await expect(activePhoto.locator('time')).toHaveText(/^[A-Z][a-z]+ \d{1,2}, \d{4}$/);
    await expect(activePhoto.locator('.text-center')).toHaveCSS('transition-property', 'opacity');
    await expect(activePhoto.locator('.text-center')).toHaveCSS('opacity', '1');
  });

  test('photo deep links open the fullscreen viewer and update during navigation', async ({ page }) => {
    const response = await page.request.get('/photography/14');
    expect(await response.text()).toMatch(/class="[^"]*photo-scroll-container[^"]*invisible[^"]*"/);

    await page.goto('/photography/14');

    await expect(page).toHaveTitle(/Photography/i);
    await expect(page).toHaveURL(/\/photography\/14$/);
    await expect(page.getByRole('button', { name: /back/i })).toBeVisible();
    await expect(page.locator('.photo-scroll-container')).toHaveClass(/visible/);
    await expect.poll(() => page.locator('.snap-y').evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    const initialScrollTop = await page.locator('.snap-y').evaluate((element) => element.scrollTop);

    await page.locator('.snap-y').press('ArrowRight');

    await expect.poll(() => page.locator('html').getAttribute('data-photo-transition')).toBe('right');
    await expect(page.getByTestId('photo-scroll-indicator')).toBeVisible();
    await expect(page.getByTestId('photo-scroll-indicator-thumb')).toBeVisible();
    await expect(page.getByTestId('photo-scroll-indicator-thumb')).toHaveCSS('background-color', 'rgb(10, 132, 255)');
    await expect(page.getByRole('button', { name: /back/i })).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () => getComputedStyle(document.documentElement, '::view-transition-old(photography-back-button)').display
        )
      )
      .toBe('none');
    await expect(page).toHaveURL(/\/photography\/15$/);
    await expect
      .poll(() => page.locator('.snap-y').evaluate((element) => element.scrollTop))
      .toBeGreaterThan(initialScrollTop);

    await page.keyboard.press('ArrowLeft');

    await expect(page).toHaveURL(/\/photography\/14$/);
    await expect.poll(() => page.locator('.snap-y').evaluate((element) => element.scrollTop)).toBe(initialScrollTop);
  });

  test('vertical photo navigation updates the photo and URL', async ({ page }) => {
    await page.goto('/photography/14');

    const gallery = page.locator('.snap-y');
    await expect.poll(() => gallery.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    const initialScrollTop = await gallery.evaluate((element) => element.scrollTop);

    await page.keyboard.press('ArrowDown');

    await expect.poll(() => page.locator('html').getAttribute('data-photo-transition')).toBe('down');
    await expect(page).toHaveURL(/\/photography\/15$/);
    await expect.poll(() => gallery.evaluate((element) => element.scrollTop)).toBeGreaterThan(initialScrollTop);

    await page.keyboard.press('ArrowUp');

    await expect.poll(() => page.locator('html').getAttribute('data-photo-transition')).toBe('up');
    await expect(page).toHaveURL(/\/photography\/14$/);
    await expect.poll(() => gallery.evaluate((element) => element.scrollTop)).toBe(initialScrollTop);
  });

  test('photo navigation falls back to an immediate update without View Transitions', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(document, 'startViewTransition', { configurable: true, value: undefined });
    });
    await page.goto('/photography/14');

    await expect.poll(() => page.locator('.snap-y').evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    const initialScrollTop = await page.locator('.snap-y').evaluate((element) => element.scrollTop);
    await page.locator('.snap-y').press('ArrowRight');

    await expect(page).toHaveURL(/\/photography\/15$/);
    await expect
      .poll(() => page.locator('.snap-y').evaluate((element) => element.scrollTop))
      .toBeGreaterThan(initialScrollTop);
  });
});

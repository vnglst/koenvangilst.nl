import { expect, test } from '@playwright/test';

/**
 * Simulates a bad mobile connection and verifies that:
 * 1. A navigation progress indicator is visible while a page transition is pending.
 * 2. The destination page eventually renders correctly.
 *
 * Uses Playwright's route interception to reliably delay server function
 * responses (/_serverFn/*) — CDP throttling does not affect loopback connections.
 */
test.describe('slow network navigation', () => {
  test('shows a loading indicator during page transition on slow network', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'Koen van Gilst' })).toBeVisible();

    // Wait for TanStack Router to finish hydrating on the client.
    // The heading visible only means SSR HTML is rendered; React hydration
    // and router initialization happen shortly after.
    await page.waitForFunction(() => typeof (window as any).__TSR_ROUTER__ !== 'undefined');

    // Move mouse away from nav links to prevent hover-based preloading before
    // we set up the delay interceptor.
    await page.mouse.move(0, 0);

    // Intercept server-function requests and add a 1.5 s delay to simulate a
    // bad mobile connection. /_serverFn/* is the TanStack Start server fn endpoint.
    await page.route('**/_serverFn/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await route.continue();
    });

    // Trigger navigation via a programmatic JS click to avoid Playwright's
    // mouse simulation dispatching mouseover/mouseenter events that would
    // trigger TanStack Router's intent-based preloading before the click fires.
    await page
      .locator('a[href="/lab"]')
      .first()
      .evaluate((el: HTMLAnchorElement) => el.click());

    // The progress bar should appear before the page finishes loading.
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible({ timeout: 3000 });

    // Destination page should load successfully after the delay.
    await expect(page).toHaveURL(/\/lab/, { timeout: 10_000 });
    await expect(page.getByRole('heading', { level: 1, name: /articles & experiments/i })).toBeVisible({
      timeout: 10_000
    });

    // Progress bar should be gone after navigation completes.
    await expect(page.locator('[role="progressbar"]')).not.toBeVisible({ timeout: 5000 });
  });
});

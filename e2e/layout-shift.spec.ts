import { expect, test } from '@playwright/test';

/**
 * Reproduces and guards against a layout shift where the sidebar briefly
 * appears centred and then jumps to the left while a blog post loads.
 */
test.describe('layout shift on blog posts', () => {
  test('no cumulative layout shift on direct navigation to a blog post', async ({ page }) => {
    // Collect layout shift entries via the Layout Instability API.
    await page.addInitScript(() => {
      (window as any).__layoutShiftEntries = [];
      const observer = new (window as any).PerformanceObserver((list: any) => {
        for (const entry of list.getEntries()) {
          (window as any).__layoutShiftEntries.push(entry);
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
    });

    // Use a stable, well-known post slug.
    await page.goto('/lab/clean-code-is-a-phase');

    await expect(page.getByRole('heading', { level: 1, name: /clean code/i })).toBeVisible();
    await expect(page.getByRole('navigation', { name: /main navigation/i })).toBeVisible();

    // Allow a short settle period for any late-running layout shifts.
    await page.waitForTimeout(500);

    const cls = await page.evaluate(() => {
      return (window as any).__layoutShiftEntries.reduce(
        (sum: number, entry: any) => sum + entry.value,
        0
      );
    });

    // CLS should be negligible; > 0.1 is considered poor.
    expect(cls).toBeLessThan(0.1);
  });

  test('sidebar is stable during client-side navigation to a blog post', async ({ page }) => {
    await page.goto('/lab');
    await expect(page.getByRole('heading', { level: 1, name: /articles & experiments/i })).toBeVisible();

    // Wait for hydration so TanStack Router is in control.
    await page.waitForFunction(() => typeof (window as any).__TSR_ROUTER__ !== 'undefined');

    // Move mouse away to prevent hover-based preloading.
    await page.mouse.move(0, 0);

    // Intercept the MDX chunk for this post to reliably delay it.
    await page.route(/clean-code-is-a-phase/, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.continue();
    });

    // Track the sidebar bounding box over time.
    const sidebarMoves: { x: number; y: number; timestamp: number }[] = [];
    const interval = setInterval(async () => {
      const box = await page.locator('aside').first().boundingBox().catch(() => null);
      if (box) {
        sidebarMoves.push({ x: box.x, y: box.y, timestamp: Date.now() });
      }
    }, 50);

    // Navigate to a specific post via JS click.
    await page
      .locator('a[href="/lab/clean-code-is-a-phase"]')
      .first()
      .evaluate((el: HTMLAnchorElement) => el.click());

    await expect(page).toHaveURL(/\/lab\/clean-code-is-a-phase$/, { timeout: 10_000 });
    await expect(page.getByRole('heading', { level: 1, name: /clean code/i })).toBeVisible({
      timeout: 10_000
    });

    clearInterval(interval);
    await page.waitForTimeout(300);

    // The sidebar should never have jumped horizontally (x should stay stable).
    const xs = sidebarMoves.map((m) => m.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const xDelta = maxX - minX;

    // A jump of more than 50 px is the bug we are guarding against.
    expect(xDelta).toBeLessThan(50);
  });

  test('skeleton does not flash for fast loads', async ({ page }) => {
    await page.goto('/lab');
    await expect(page.getByRole('heading', { level: 1, name: /articles & experiments/i })).toBeVisible();

    // Wait for hydration.
    await page.waitForFunction(() => typeof (window as any).__TSR_ROUTER__ !== 'undefined');
    await page.mouse.move(0, 0);

    // Delay the MDX chunk for 2 s so it definitely outlasts the skeleton delay.
    await page.route(/clean-code-is-a-phase/, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.continue();
    });

    await page
      .locator('a[href="/lab/clean-code-is-a-phase"]')
      .first()
      .evaluate((el: HTMLAnchorElement) => el.click());

    await expect(page).toHaveURL(/\/lab\/clean-code-is-a-phase$/, { timeout: 10_000 });

    const skeletonLocator = page.locator('[class*="animate-pulsing-delayed"]').first();

    // After 500 ms the skeleton should still be hidden.
    await page.waitForTimeout(500);
    await expect(skeletonLocator).not.toBeVisible();

    // After 1.2 s the skeleton should be visible because the chunk is still loading.
    await page.waitForTimeout(800);
    await expect(skeletonLocator).toBeVisible();

    // Eventually the real content replaces it.
    await expect(page.getByRole('heading', { level: 1, name: /clean code/i })).toBeVisible({
      timeout: 10_000
    });
    await expect(skeletonLocator).not.toBeVisible();
  });
});

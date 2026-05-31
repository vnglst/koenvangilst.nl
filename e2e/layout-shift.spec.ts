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
      return (window as any).__layoutShiftEntries.reduce((sum: number, entry: any) => sum + entry.value, 0);
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
    await page.route(/\/assets\/clean-code-is-a-phase/, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.continue();
    });

    // Track the sidebar bounding box over time.
    const sidebarMoves: { x: number; y: number; timestamp: number }[] = [];
    const interval = setInterval(async () => {
      const box = await page
        .locator('aside')
        .first()
        .boundingBox()
        .catch(() => null);
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
    // Navigate directly to a post — this exercises the direct-load path (SSR + hydration).
    // Any skeleton flash here would show as a CLS hit.
    await page.addInitScript(() => {
      (window as any).__layoutShiftEntries = [];
      const observer = new (window as any).PerformanceObserver((list: any) => {
        for (const entry of list.getEntries()) {
          (window as any).__layoutShiftEntries.push(entry);
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
    });

    await page.goto('/lab/clean-code-is-a-phase');
    await expect(page.getByRole('heading', { level: 1, name: /clean code/i })).toBeVisible();

    // Allow a short settle period.
    await page.waitForTimeout(1300);

    // Verify the skeleton CSS is configured correctly: opacity starts at 0
    // (hidden) and only animates into view after a 1-second delay.
    const skeletonStyle = await page.evaluate(() => {
      const el = document.querySelector('.animate-pulsing-delayed');
      if (!el) return null;
      const style = getComputedStyle(el);
      return {
        opacity: style.opacity,
        animationDelay: style.animationDelay,
        animationName: style.animationName
      };
    });

    // If a skeleton is present in the DOM, it must have the correct delay so it
    // doesn't flash on fast loads.
    if (skeletonStyle) {
      expect(parseFloat(skeletonStyle.animationDelay)).toBeGreaterThanOrEqual(1);
    }

    // No significant layout shift.
    const cls = await page.evaluate(() => {
      return (window as any).__layoutShiftEntries.reduce((sum: number, entry: any) => sum + entry.value, 0);
    });
    expect(cls).toBeLessThan(0.1);
  });
});

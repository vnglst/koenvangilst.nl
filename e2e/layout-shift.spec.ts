import { expect, test } from '@playwright/test';

test.describe('layout shift on blog post', () => {
  test('sidebar position does not shift while MDX Suspense resolves', async ({ page }) => {
    // Simulate slow MDX chunk loading to trigger the Suspense boundary.
    // The PostPage Suspense should show a Container-wrapped skeleton,
    // preserving the sidebar position throughout.

    let releaseMdx: () => void;
    const mdxReady = new Promise<void>((r) => { releaseMdx = r; });

    await page.route('**/assets/_slug-*.js', async (route) => {
      await mdxReady;
      await route.continue();
    });

    await page.goto('/lab/ai-and-the-future-of-engineering', { waitUntil: 'domcontentloaded' });

    const aside = page.locator('aside');
    await expect(aside).toBeAttached({ timeout: 10_000 });
    await page.waitForTimeout(500);

    // Position while Suspense is pending (skeleton showing)
    const loadingBox = await aside.boundingBox();
    const loadingX = loadingBox?.x ?? -1;
    console.log(`Loading (skeleton) aside x: ${loadingX}`);

    // Release MDX chunks
    releaseMdx!();

    // Wait for article content to appear
    await expect(page.getByRole('heading', { level: 1, name: /Growing/i })).toBeVisible({
      timeout: 15_000
    });
    await page.waitForTimeout(500);

    const resolvedBox = await aside.boundingBox();
    const resolvedX = resolvedBox?.x ?? -1;
    console.log(`Resolved aside x: ${resolvedX}`);

    // Sidebar x must be stable (tolerance of 2px)
    expect(resolvedX, `sidebar shifted: ${loadingX} → ${resolvedX}`).toBeCloseTo(loadingX, 0);
  });

  test('sidebar x does not change on direct navigation without throttling', async ({ page }) => {
    // Plain navigation — verify no shift in normal conditions
    await page.goto('/lab/ai-and-the-future-of-engineering');

    const aside = page.locator('aside');
    await expect(aside).toBeAttached({ timeout: 10_000 });

    const box1 = await aside.boundingBox();
    const x1 = box1?.x ?? -1;

    // Wait for full hydration
    await expect(page.getByRole('heading', { level: 1, name: /Growing/i })).toBeVisible({
      timeout: 10_000
    });
    await page.waitForTimeout(500);

    const box2 = await aside.boundingBox();
    const x2 = box2?.x ?? -1;

    console.log(`Initial x: ${x1}, final x: ${x2}`);
    expect(x2).toBeCloseTo(x1, 0);
  });
});

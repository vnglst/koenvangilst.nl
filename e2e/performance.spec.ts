import { expect, test } from '@playwright/test';
import path from 'node:path';

// Decoded script bytes are stable across machines and work with both the Node
// preview and Nginx gzip. Wall-clock timings are recorded, not used as flaky gates.
for (const route of ['/', '/lab', '/lab/clean-code-is-a-phase', '/lab/prognosis-2100']) {
  test(`JavaScript loading budget: ${route}`, async ({ page }, testInfo) => {
    for (const filename of [
      'yearly-weather-data.json',
      'monthly-weather-data.json',
      'co2_levels.json',
      'sealevels.json'
    ]) {
      await page.route(`https://raw.githubusercontent.com/vnglst/dutch-climate-data/main/data/${filename}`, (request) =>
        request.fulfill({ path: path.resolve('e2e/fixtures/climate', filename), contentType: 'application/json' })
      );
    }
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForFunction(() => typeof (window as any).__TSR_ROUTER__ !== 'undefined');
    if (route === '/lab/prognosis-2100') {
      await expect(page.locator('[_echarts_instance_]')).toHaveCount(3);
      await expect(page.locator('.chart-loading')).toHaveCount(0);
    }
    const metrics = await page.evaluate(() => {
      const scripts = (performance.getEntriesByType('resource') as PerformanceResourceTiming[]).filter(
        (entry) => new URL(entry.name).origin === location.origin && /\/assets\/.*\.js$/.test(entry.name)
      );
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        scriptBytes: scripts.reduce((sum, entry) => sum + entry.decodedBodySize, 0),
        scriptRequests: scripts.length,
        domContentLoadedMs: navigation.domContentLoadedEventEnd,
        readyMs: performance.now(),
        scripts: scripts.map((entry) => ({ url: new URL(entry.name).pathname, bytes: entry.decodedBodySize }))
      };
    });
    await testInfo.attach('loading-metrics', {
      body: JSON.stringify(metrics, null, 2),
      contentType: 'application/json'
    });

    expect(metrics.scriptBytes).toBeGreaterThan(0);
    expect(metrics.scriptBytes).toBeLessThan(route === '/lab/prognosis-2100' ? 1_250_000 : 460_000);
    expect(metrics.scriptRequests).toBeLessThanOrEqual(route === '/lab/prognosis-2100' ? 14 : 20);
    expect(errors).toEqual([]);
  });
}

import { expect, test } from '@playwright/test';

// These are decoded resource budgets, independent of Nginx compression and
// machine speed. The baseline loaded 787/789/845 KB respectively.
const pages = [
  { path: '/', resourceBudget: 670_000, fontBudget: 170_000 },
  { path: '/lab', resourceBudget: 680_000, fontBudget: 170_000 },
  { path: '/lab/ai-and-the-future-of-engineering', resourceBudget: 800_000, fontBudget: 240_000 }
];

for (const { path, resourceBudget, fontBudget } of pages) {
  test(`cold loading budget: ${path}`, async ({ page }, testInfo) => {
    // A fresh Playwright context gives each page an empty browser cache.
    // Keep analytics and speculative production-site requests out of the sample.
    const origin = new URL(testInfo.project.use.baseURL!).origin;
    await page.route('**/*', (route) =>
      new URL(route.request().url()).origin === origin ? route.continue() : route.abort()
    );
    // Optional, reproducible constrained-bandwidth comparison. Serialize the
    // response-byte budget across requests (1.6 Mbit/s, 100 ms latency).
    // This also works on loopback, where network emulation can be inconsistent.
    if (process.env.LOADING_BENCHMARK === '1') {
      let availableAt = Date.now();
      await page.route('**/*', async (route) => {
        const url = new URL(route.request().url());
        if (url.origin !== origin) return route.abort();
        const response = await route.fetch();
        const body = await response.body();
        const finish = Math.max(Date.now() + 100, availableAt) + body.length / 200;
        availableAt = finish;
        await new Promise((resolve) => setTimeout(resolve, Math.max(0, finish - Date.now())));
        await route.fulfill({ response, body });
      });
    }
    await page.setViewportSize({ width: 390, height: 844 });

    await page.addInitScript(() => {
      const metrics = { lcp: 0, cls: 0 };
      Object.assign(window, { loadingMetrics: metrics });
      new PerformanceObserver((list) => {
        metrics.lcp = list.getEntries().at(-1)!.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
          if (!shift.hadRecentInput) metrics.cls += shift.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    await page.goto(path);
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForFunction(() => '__TSR_ROUTER__' in window);
    await page.evaluate(() => document.fonts.ready);
    // Include article chunks, styles and fonts discovered during hydration.
    await page.waitForLoadState('networkidle');

    const metrics = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const local = resources.filter((entry) => new URL(entry.name).origin === location.origin);
      const fonts = local.filter((entry) => new URL(entry.name).pathname.endsWith('.woff2'));
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const observed = (window as unknown as { loadingMetrics: { lcp: number; cls: number } }).loadingMetrics;
      return {
        ...observed,
        ttfb: navigation.responseStart - navigation.startTime,
        fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        resourceBytes: local.reduce((sum, entry) => sum + entry.decodedBodySize, 0),
        fontBytes: fonts.reduce((sum, entry) => sum + entry.decodedBodySize, 0),
        fonts: fonts.map((entry) => new URL(entry.name).pathname),
        scripts: local.filter((entry) => new URL(entry.name).pathname.endsWith('.js')).map((entry) => entry.name)
      };
    });
    await testInfo.attach('loading-metrics', {
      body: JSON.stringify({ path, ...metrics }, null, 2),
      contentType: 'application/json'
    });

    // Fail explicitly if resource timing stops reporting sizes; a zero-byte
    // measurement must not silently make the budgets pass.
    expect(metrics.fontBytes).toBeGreaterThan(0);
    expect(metrics.resourceBytes).toBeGreaterThan(0);
    expect(metrics.scripts.length).toBeGreaterThan(0);
    expect(metrics.fonts).toEqual(
      expect.arrayContaining([
        '/fonts/ibm-plex-sans-400.woff2',
        '/fonts/ibm-plex-sans-600.woff2',
        '/fonts/Nimbus-Sans-D-OT-Bold-Extended_32745.woff2'
      ])
    );
    expect(metrics.fontBytes).toBeLessThan(fontBudget);
    expect(metrics.resourceBytes).toBeLessThan(resourceBudget);
    expect(metrics.fonts).not.toContain('/fonts/ibm-plex-sans-500.woff2');
    expect(metrics.cls).toBeLessThan(0.1);
    expect(metrics.lcp).toBeGreaterThan(0);
    // Article/chart bundles should stay lazy on the home and listing pages.
    if (path === '/' || path === '/lab') {
      expect(metrics.fonts).not.toContain('/fonts/ibm-plex-sans-700.woff2');
      expect(metrics.scripts.some((url) => /\/assets\/(?:charts-|WeatherAnomaly-|ai-and-the-future-)/.test(url))).toBe(
        false
      );
    }
  });
}

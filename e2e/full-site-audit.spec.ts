import { expect, test } from '@playwright/test';

test.describe('complete local content audit', () => {
  test.skip(
    process.env.FULL_SITE_AUDIT !== '1',
    'Run with FULL_SITE_AUDIT=1 against a production build with actual content.'
  );

  test('every content page renders in both themes at desktop and phone widths', async ({ page, request }) => {
    test.setTimeout(600_000);
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBe(true);
    const paths = new Set(
      [...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)]
        .map((match) => new URL(match[1]).pathname)
        .filter((path) => !path.startsWith('/photography/'))
    );
    for (const path of ['/lab/ons-land', '/lab/prognosis-2100', '/lab/gen-art-gallery']) paths.add(path);
    const errors: string[] = [];
    const tags = new Set<string>();
    page.on('pageerror', (error) => errors.push(`${page.url()}: ${error.message}`));
    for (const path of paths) {
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(response?.status(), path).toBe(200);
      await expect(page.locator('main h1'), path).toHaveCount(1);
      await expect(page.getByRole('navigation', { name: 'Main navigation', includeHidden: true }), path).toHaveCount(1);
      // Wait for lazy MDX and its CSS before measuring the actual content.
      if (
        path.startsWith('/lab/') &&
        !['/lab/ons-land', '/lab/prognosis-2100', '/lab/gen-art-gallery'].includes(path)
      ) {
        await expect(page.locator('.reading-column .prose'), path).not.toBeEmpty();
      }
      for (const href of await page
        .locator('a[href^="/tag/"]')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href')!)))
        tags.add(href);
      for (const width of [1280, 390]) {
        await page.setViewportSize({ width, height: 900 });
        for (const theme of ['dark', 'light']) {
          const current = await page.locator('html').getAttribute('class');
          if (current?.includes('dark') !== (theme === 'dark'))
            await page.getByRole('button', { name: /switch to .* mode/i }).click();
          expect(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            `${path} ${width}px ${theme}`
          ).toBe(true);
        }
      }
    }
    for (const path of tags) {
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(response?.status(), path).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: /posts about/i })).toBeVisible();
      expect(await page.locator('.post-link').count(), path).toBeGreaterThan(0);
    }
    expect(errors).toEqual([]);
    console.log(`Audited ${paths.size} content routes and ${tags.size} topic archives in both themes.`);
  });

  test('content images and embedded media have working source URLs', async ({ page, request }) => {
    test.setTimeout(300_000);
    const sitemap = await request.get('/sitemap.xml');
    const paths = [...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)]
      .map((match) => new URL(match[1]).pathname)
      .filter((path) => path.startsWith('/lab/'));
    const assets = new Set<string>();
    for (const path of paths) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      const prose = page.locator('.reading-column .prose');
      if (await prose.count()) await expect(prose).not.toBeEmpty();
      const urls = await page
        .locator('main img, main video, main video source, main audio source')
        .evaluateAll((elements) =>
          elements
            .map((element) => element.getAttribute('src'))
            .filter((src): src is string => !!src && !src.startsWith('data:'))
        );
      for (const url of urls) assets.add(url);
    }
    const failed: string[] = [];
    for (const url of assets) {
      const response = await request.get(url, {
        headers: { Range: 'bytes=0-255', 'Accept-Encoding': 'identity' },
        timeout: 20_000
      });
      if (![200, 206].includes(response.status())) failed.push(`${response.status()} ${url}`);
      await response.dispose();
    }
    expect(failed).toEqual([]);
    console.log(`Checked ${assets.size} unique article image/media sources.`);
  });
});

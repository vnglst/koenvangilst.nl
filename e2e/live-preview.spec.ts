import { expect, test } from '@playwright/test';

test.describe('real local preview integrations', () => {
  test.skip(process.env.LIVE_PREVIEW !== '1', 'Run with LIVE_PREVIEW=1 against the preview with real local content.');

  test('all mirrored photos and responsive variants are served', async ({ request, page }) => {
    test.setTimeout(90_000);
    const manifest = await request.get('/photos-data.json');
    expect(manifest.ok()).toBe(true);
    const photos = (await manifest.json()) as Array<{ id: number; src: string; srcSet: string; srcSetWebp: string }>;
    expect(photos.length).toBeGreaterThan(3);
    const urls = [
      ...new Set(
        photos.flatMap((photo) =>
          [photo.src, ...photo.srcSet.split(','), ...photo.srcSetWebp.split(',')]
            .map((entry) => entry.trim().split(/\s+/)[0])
            .filter(Boolean)
        )
      )
    ];
    for (let i = 0; i < urls.length; i += 12) {
      await Promise.all(
        urls.slice(i, i + 12).map(async (url) => {
          const response = await request.head(url, { headers: { 'Accept-Encoding': 'identity' } });
          expect(response.status(), url).toBe(200);
          expect(response.headers()['content-type'], url).toMatch(/^image\//);
          await response.dispose();
        })
      );
    }
    await page.goto('/photography');
    await expect(page.locator('.photo-grid img')).toHaveCount(photos.length);
    for (const index of [0, Math.floor(photos.length / 2), photos.length - 1]) {
      await page.goto(`/photography/${photos[index].id}`);
      const image = page.locator('.photo-slide img');
      await expect(image).toBeVisible();
      await expect
        .poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0))
        .toBe(true);
      await expect(page.locator('.photo-caption')).not.toBeEmpty();
    }
  });

  test('all ten art projects are discoverable and their real embeds load', async ({ page }) => {
    test.setTimeout(180_000);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/lab/gen-art-gallery');
    const picker = page.getByRole('combobox', { name: 'Choose an art project' });
    await expect(picker.locator('option')).toHaveCount(10);
    const projects = await picker.locator('option').evaluateAll((options) =>
      options.map((option) => ({
        slug: (option as HTMLOptionElement).value,
        title: option.textContent!.replace(/^\d+\. /, '')
      }))
    );
    for (const { slug, title } of projects) {
      await picker.selectOption(slug);
      const embed = page.locator('iframe');
      await expect(embed).toHaveAttribute('title', title);
      await expect(page.frameLocator('iframe').locator('body')).toBeVisible({ timeout: 20_000 });
      expect(await page.frameLocator('iframe').locator('body').innerHTML(), title).not.toBe('');
      await expect(page.getByRole('link', { name: /open in new tab/i })).toHaveAttribute(
        'href',
        slug === 'time-flies' ? 'https://time-flies.koenvangilst.nl' : (await embed.getAttribute('src'))!
      );
    }
    expect(errors).toEqual([]);
  });

  test('main screens fit a phone and load without application errors', async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 390, height: 844 });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const route of [
      '/',
      '/lab',
      '/lab?q=snippet',
      '/lab?q=side-project',
      '/lab/jwt-token',
      '/lab/code-doesnt-speak-for-itself',
      '/tag/stoicism',
      '/photography',
      '/lab/ons-land',
      '/lab/prognosis-2100',
      '/lab/aranet4-co2-monitor'
    ]) {
      await page.goto(route);
      await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
    }
    expect(errors).toEqual([]);
  });
});

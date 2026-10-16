import { expect, test } from '@playwright/test';

test.describe('Familiar mobile layout', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('navigation expands above content and closes after following a link', async ({ page }) => {
    await page.goto('/lab?q=snippet');
    const navigation = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(navigation).toBeHidden();
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await expect(navigation).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Lab', exact: true })).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('button', { name: 'snippets', exact: true })).toHaveAttribute('aria-pressed', 'true');
    const menu = await navigation.boundingBox();
    const content = await page.locator('main').boundingBox();
    expect(menu!.y + menu!.height).toBeLessThan(content!.y);
    await navigation.getByRole('link', { name: 'About', exact: true }).click();
    await expect(page.getByText('Recent articles')).toBeVisible();
    await expect(navigation).toBeHidden();
    for (const path of ['/', '/lab', '/lab/code-doesnt-speak-for-itself', '/photography', '/lab/gen-art-gallery']) {
      await page.goto(path);
      await expect(page.locator('.signature-portrait')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Open navigation' })).toBeVisible();
      await expect(navigation).toBeHidden();
      if (await page.locator('.site-footer').count()) await page.locator('.site-footer').scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  });

  test('theme choice persists across navigation and reload', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page.getByRole('navigation').getByRole('link', { name: 'Lab', exact: true }).click();
    await page.reload();
    await expect(page.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('code scrolls inside its block without overflowing the page', async ({ page }) => {
    await page.goto('/lab/jwt-token');
    await expect(page.getByRole('heading', { name: 'Decoding a JWT token' })).toBeVisible();
    const code = page.locator('pre').first();
    await expect(code).toBeVisible();
    expect(await code.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });

  test('photo controls navigate and retain their position after resizing', async ({ page }) => {
    await page.goto('/photography/15');
    const caption = page.locator('.photo-caption time');
    await expect(caption).toBeVisible();
    const selectedDate = await caption.getAttribute('datetime');
    await page.goto('/photography/14');
    await page.getByRole('button', { name: 'Next photograph' }).click();
    await expect(page).toHaveURL(/\/photography\/15$/);
    await page.setViewportSize({ width: 844, height: 390 });
    await expect(caption).toHaveAttribute('datetime', selectedDate!);
    await expect(page.locator('.photo-slide img')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.getByRole('button', { name: 'Previous photograph' }).click();
    await expect(page).toHaveURL(/\/photography\/14$/);
  });
});

test('code copying preserves the complete command', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/lab/jwt-token');
  const code = page.locator('pre').first();
  await expect(code).toContainText('paste token here');
  const expected = await code.textContent();
  await page.getByRole('button', { name: 'Copy code', exact: true }).click();
  await expect(page.getByText('Copied', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(expected);
});

test('historical article and feed URLs work in a direct production preview', async ({ request }) => {
  for (const section of ['blog', 'labs', 'projects', 'portfolio', 'clients', 'snippets']) {
    const response = await request.get(`/${section}/jwt-token`, { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    expect(response.headers().location).toBe('/lab/jwt-token');
  }
  const response = await request.get('/blog/feed', { maxRedirects: 0 });
  expect(response.headers().location).toBe('/feed.xml');
});

test('project metadata URLs redirect to their actual interactive screens', async ({ page }) => {
  for (const slug of ['gen-art-gallery', 'ons-land', 'prognosis-2100']) {
    const response = await page.goto(`/lab/${slug}-project`);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(new RegExp(`/lab/${slug}$`));
    await expect(page.locator('main h1')).toHaveCount(1);
  }
});

test('retired CO2 demo leads to the article without sensor polling', async ({ page }) => {
  const sensorRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).pathname === '/api/co2') sensorRequests.push(request.url());
  });
  await page.goto('/lab/co2');
  await expect(page).toHaveURL(/\/lab\/aranet4-co2-monitor$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Displaying Aranet4 CO2 readings on my website' })
  ).toBeVisible();
  await expect(page.getByText('The live demo has been retired.', { exact: false })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Requirements', exact: true })).toBeVisible();
  expect(sensorRequests).toEqual([]);
});

test('Personal signature retains the portrait and blue active navigation', async ({ page }) => {
  await page.goto('/');
  const portrait = page.locator('.signature-portrait');
  await expect(portrait).toBeVisible();
  await expect(portrait).toHaveAttribute('src', '/avatar.jpg');
  for (const path of ['/lab', '/lab/code-doesnt-speak-for-itself', '/photography', '/lab/gen-art-gallery']) {
    await page.goto(path);
    await expect(page.locator('.signature-portrait')).toBeVisible();
    await expect(page.locator('.site-biography')).toHaveCount(0);
    const active = page.locator('nav[aria-label="Main navigation"] a[aria-current="page"]');
    await expect(active).toHaveCount(1);
    expect(await active.evaluate((element) => getComputedStyle(element).color)).toBe('rgb(66, 165, 245)');
  }
});

test('photo detail uses the whole viewport in both themes and every orientation', async ({ page }) => {
  test.setTimeout(90_000);
  for (const theme of ['dark', 'light']) {
    await page.goto('/');
    const current = await page.locator('html').getAttribute('class');
    if (current?.includes('dark') !== (theme === 'dark'))
      await page.getByRole('button', { name: /switch to .* mode/i }).click();
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
      { width: 844, height: 390 }
    ]) {
      await page.setViewportSize(viewport);
      await page.goto('/photography/14');
      const image = page.locator('.photo-slide img');
      await expect(image).toBeVisible();
      await expect(page.getByRole('navigation', { name: 'Main navigation' })).toHaveCount(0);
      await expect(page.locator('.site-footer, .site-theme')).toHaveCount(0);
      const bounds = await image.boundingBox();
      expect(bounds!.x).toBe(0);
      expect(bounds!.y).toBe(0);
      expect(bounds!.width).toBe(viewport.width);
      expect(bounds!.height).toBe(viewport.height);
      expect(await image.evaluate((element) => getComputedStyle(element).objectFit)).toBe('contain');
      expect(await page.locator('.photo-viewer').evaluate((element) => getComputedStyle(element).backgroundColor)).toBe(
        'rgb(9, 9, 9)'
      );
      expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)).toBe(true);
      const caption = await page.locator('.photo-caption').boundingBox();
      const controls = await page.locator('.photo-viewer-controls').boundingBox();
      expect(caption!.x + caption!.width).toBeLessThanOrEqual(controls!.x);
      for (const button of await page.locator('.photo-viewer button').all()) {
        const box = await button.boundingBox();
        expect(box!.y).toBeGreaterThanOrEqual(0);
        expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
      }
      await page.getByRole('button', { name: 'Next photograph' }).click();
      await expect(page).toHaveURL(/\/photography\/15$/);
      await page.keyboard.press('Escape');
      await expect(page).toHaveURL(/\/photography$/);
      await expect(page.locator('.signature-portrait')).toBeVisible();
    }
  }
});

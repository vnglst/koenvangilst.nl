import { expect, test, type Page } from '@playwright/test';

const BLOG_POSTS_WITH_IMAGES = [
  {
    slug: 'gemini-svg-sunflowers',
    title: 'Gemini Paints Sunflowers in SVG'
  },
  {
    slug: 'react-hooks-with-canvas',
    title: 'Using React Hooks with canvas'
  },
  {
    slug: 'api-testing-with-jest',
    title: 'API testing with Jest'
  }
] as const;

async function expectRenderedBlogImagesToLoad(page: Page) {
  const images = page.locator('article img');
  const imageCount = await images.count();

  expect(imageCount).toBeGreaterThan(0);

  for (let index = 0; index < imageCount; index += 1) {
    const image = images.nth(index);

    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(
        async () =>
          image.evaluate((img) => ({
            complete: img.complete,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            currentSrc: img.currentSrc || img.getAttribute('src') || ''
          })),
        { timeout: 20_000 }
      )
      .toMatchObject({
        complete: true
      });

    const imageState = await image.evaluate((img) => ({
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      currentSrc: img.currentSrc || img.getAttribute('src') || ''
    }));

    expect(imageState.naturalWidth).toBeGreaterThan(0);
    expect(imageState.naturalHeight).toBeGreaterThan(0);
    expect(imageState.currentSrc.length).toBeGreaterThan(0);
  }
}

test.describe('blog post images', () => {
  for (const post of BLOG_POSTS_WITH_IMAGES) {
    test(`renders loaded images for ${post.slug}`, { timeout: 60_000 }, async ({ page }) => {
      await page.goto(`/lab/${post.slug}`);

      await expect(page.getByRole('heading', { level: 1, name: post.title })).toBeVisible();
      await expectRenderedBlogImagesToLoad(page);
    });
  }
});

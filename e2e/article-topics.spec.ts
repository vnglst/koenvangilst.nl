import { expect, test } from '@playwright/test';

for (const width of [320, 1440]) {
  test(`article topics are quiet footer links at ${width}px and Lab omits counts`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/lab');
    await expect(page.getByText(/^\d+ entr(?:y|ies)$/)).toHaveCount(0);
    await page.getByRole('button', { name: 'snippets', exact: true }).click();
    await expect(page.getByText(/^\d+ entr(?:y|ies)$/)).toHaveCount(0);
    await page.goto('/lab/two-uncomfortably-exciting-conference-talks');
    await expect(page.locator('.page-header a[href^="/tag/"]')).toHaveCount(0);
    const topics = page.getByRole('list', { name: 'Article topics' });
    await topics.scrollIntoViewIfNeeded();
    await expect(topics.getByRole('link')).toHaveCount(3);
    const body = await page.locator('.article-body').boundingBox();
    const footer = await page.locator('.article-footer').boundingBox();
    expect(footer!.y).toBeGreaterThan(body!.y + body!.height);
    const topic = topics.getByRole('link', { name: 'conferences', exact: true });
    await expect(topic).toHaveCSS('font-size', '13px');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await topic.click();
    await expect(page).toHaveURL(/\/tag\/conferences$/);
    await expect(page.getByRole('heading', { level: 1, name: /posts about conferences/i })).toBeVisible();
  });
}

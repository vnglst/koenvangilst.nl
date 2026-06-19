import { expect, test } from '@playwright/test';

test.describe('sitemap.xml', () => {
  test('returns valid XML with correct content type', async ({ request }) => {
    const response = await request.get('/sitemap.xml');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/xml');
  });

  test('contains XML declaration and urlset root element', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const body = await response.text();

    expect(body).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(body).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(body).toContain('</urlset>');
  });

  test('includes static page URLs', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const body = await response.text();

    expect(body).toContain('<loc>https://koenvangilst.nl/</loc>');
    expect(body).toContain('<loc>https://koenvangilst.nl/lab</loc>');
    expect(body).toContain('<loc>https://koenvangilst.nl/photography</loc>');
  });

  test('includes blog post URLs with lastmod dates', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const body = await response.text();

    const labUrlPattern = /<loc>https:\/\/koenvangilst\.nl\/lab\/[^<]+<\/loc>/;
    expect(body).toMatch(labUrlPattern);

    const lastmodPattern = /<lastmod>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    expect(body).toMatch(lastmodPattern);
  });

  test('includes photography URLs', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const body = await response.text();

    const photoUrlPattern = /<loc>https:\/\/koenvangilst\.nl\/photography\/[^<]+<\/loc>/;
    expect(body).toMatch(photoUrlPattern);
  });

  test('sets cache-control header', async ({ request }) => {
    const response = await request.get('/sitemap.xml');

    expect(response.headers()['cache-control']).toContain('public');
    expect(response.headers()['cache-control']).toContain('max-age=86400');
  });
});

test.describe('feed.xml', () => {
  test('returns valid RSS with correct content type', async ({ request }) => {
    const response = await request.get('/feed.xml');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/rss+xml');
  });

  test('contains RSS structure with channel metadata', async ({ request }) => {
    const response = await request.get('/feed.xml');
    const body = await response.text();

    expect(body).toContain('<?xml version="1.0"');
    expect(body).toContain('<rss');
    expect(body).toContain('<channel>');
    expect(body).toContain('<title>Koen van Gilst</title>');
    expect(body).toContain('<link>https://koenvangilst.nl</link>');
    expect(body).toContain('</channel>');
    expect(body).toContain('</rss>');
  });

  test('includes blog post items with required fields', async ({ request }) => {
    const response = await request.get('/feed.xml');
    const body = await response.text();

    expect(body).toContain('<item>');
    expect(body).toContain('<title>');
    expect(body).toContain('<link>https://koenvangilst.nl/lab/');
    expect(body).toContain('<description>');
    expect(body).toContain('<pubDate>');
  });

  test('includes photo items with enclosures', async ({ request }) => {
    const response = await request.get('/feed.xml');
    const body = await response.text();

    expect(body).toContain('<title>Photo:');
    expect(body).toContain('<link>https://koenvangilst.nl/photography/');
    expect(body).toContain('<enclosure');
    expect(body).toContain('url="https://files.koenvangilst.nl/u/');
  });

  test('sets cache-control header', async ({ request }) => {
    const response = await request.get('/feed.xml');

    expect(response.headers()['cache-control']).toContain('public');
    expect(response.headers()['cache-control']).toContain('max-age=86400');
  });
});

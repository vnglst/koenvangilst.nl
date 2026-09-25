import { expect, test } from '@playwright/test';

test.describe('Nginx SSR cache', () => {
  test.skip(!process.env.BASE_URL, 'Requires the production-like Nginx container');

  test('caches public HTML and bypasses live photography pages', async ({ request }) => {
    const cacheBuster = `ssr-cache-${Date.now()}`;
    const headers = { Accept: 'text/html' };

    const firstResponse = await request.get(`/?${cacheBuster}`, { headers });
    expect(firstResponse.status()).toBe(200);
    expect(firstResponse.headers()['x-ssr-cache']).toBe('MISS');

    const secondResponse = await request.get(`/?${cacheBuster}`, { headers });
    expect(secondResponse.status()).toBe(200);
    expect(secondResponse.headers()['x-ssr-cache']).toBe('HIT');

    const photographyResponse = await request.get('/photography', { headers });
    expect(photographyResponse.status()).toBe(200);
    expect(photographyResponse.headers()['x-ssr-cache']).toBe('BYPASS');
  });
});

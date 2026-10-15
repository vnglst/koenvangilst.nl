import { createFileRoute } from '@tanstack/react-router';

import { getPosts } from '#/cms/posts-server';
import { getPhotos } from '#/lib/photos';

const BASE_URL = 'https://koenvangilst.nl';

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const photosPromise = getPhotos();
        const posts = getPosts();
        const photos = await photosPromise;

        const pages = ['', 'lab', 'photography'];

        const staticUrls = pages.map((page) => `<url><loc>${BASE_URL}/${page}</loc></url>`).join('\n  ');

        const postUrls = posts
          .map((post) => {
            const lastmod = new Date(post.publishedAt).toISOString();
            const path = post.url?.startsWith('/') ? post.url : `/lab/${post.slug}`;
            return `<url><loc>${BASE_URL}${path}</loc><lastmod>${lastmod}</lastmod></url>`;
          })
          .join('\n  ');

        const photoUrls = photos
          .map((photo) => {
            const lastmod = photo.createdAt ? new Date(photo.createdAt).toISOString() : new Date().toISOString();
            return `<url><loc>${BASE_URL}/photography/${photo.id}</loc><lastmod>${lastmod}</lastmod></url>`;
          })
          .join('\n  ');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${postUrls}
  ${photoUrls}
</urlset>`;

        return new Response(xml, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=86400'
          }
        });
      }
    }
  }
});

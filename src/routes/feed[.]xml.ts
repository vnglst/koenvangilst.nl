import { createFileRoute } from '@tanstack/react-router';

import { getPosts } from '#/cms/mdx-parser';
import { getPhotos } from '#/lib/photos';
import { RSS } from '#/lib/rss';

export const Route = createFileRoute('/feed.xml')({
  server: {
    handlers: {
      GET: async () => {
        const [posts, photos] = await Promise.all([getPosts(), getPhotos()]);

        const feed = new RSS({
          title: 'Koen van Gilst',
          site_url: 'https://koenvangilst.nl',
          feed_url: 'https://koenvangilst.nl/feed.xml'
        });

        posts.forEach((post) => {
          feed.item({
            title: post.title,
            url: `https://koenvangilst.nl/lab/${post.slug}`,
            date: post.publishedAt,
            description: post.summary
          });
        });

        photos.forEach((photo) => {
          feed.item({
            title: `Photo: ${photo.location ?? 'Unknown'}`,
            url: `https://koenvangilst.nl/photography/${photo.id}`,
            description: `A photograph taken in ${photo.location ?? 'an unknown location'}`,
            date: photo.createdAt ?? new Date().toISOString(),
            enclosure: { url: `https://koenvangilst.nl${photo.src}` }
          });
        });

        return new Response(feed.xml({ indent: true }), {
          headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=86400'
          }
        });
      }
    }
  }
});

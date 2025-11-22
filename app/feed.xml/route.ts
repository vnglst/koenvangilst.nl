import { getPosts } from 'cms/mdx-parser';

import { RSS } from 'lib/rss';

import { getPhotos } from '../photography/getPhotos';

export async function GET() {
  const feed = new RSS({
    title: 'Koen van Gilst',
    site_url: 'https://koenvangilst.nl',
    feed_url: 'https://koenvangilst.nl/feed.xml'
  });

  const posts = await getPosts();
  const photos = await getPhotos();

  posts.map((post) => {
    feed.item({
      title: post.title,
      url: `https://koenvangilst.nl/lab/${post.slug}`,
      date: post.publishedAt,
      description: post.summary
    });
  });

  photos.forEach((photo) => {
    feed.item({
      title: `Photo: ${photo.location}`,
      url: `https://koenvangilst.nl/photography/${photo.id}`,
      description: `A photograph taken in ${photo.location}`,
      date: photo.createdAt || new Date(),
      enclosure: { url: `https://koenvangilst.nl${photo.src}` }
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=0, s-maxage=86400'
    },
    status: 200
  });
}

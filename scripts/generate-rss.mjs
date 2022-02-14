import { writeFileSync } from 'fs';
import RSS from 'rss';
import { allBlogs } from 'contentlayer/generated';

async function generate() {
  const feed = new RSS({
    title: 'Koen van Gilst',
    site_url: 'https://koenvangilst.nl',
    feed_url: 'https://koenvangilst.nl/feed.xml'
  });

  allBlogs.map((post) => {
    feed.item({
      title: post.title,
      url: `https://koenvangilst.nl/blog/${post.slug}`,
      date: post.publishedAt,
      description: post.summary
    });
  });

  writeFileSync('./public/feed.xml', feed.xml({ indent: true }));
}

generate();

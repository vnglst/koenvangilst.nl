import RSS from 'rss';
import { allBlogs } from 'contentlayer/generated';

export async function GET() {
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

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=0, s-maxage=86400'
    },
    status: 200
  });
}

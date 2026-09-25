import fs from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'yaml';

const contentDir = path.join(process.cwd(), 'content');
const outputPath = path.join(process.cwd(), 'public/posts-data.json');
const files = (await fs.readdir(contentDir)).filter((file) => file.endsWith('.mdx'));
const posts = await Promise.all(
  files.map(async (file) => {
    const source = await fs.readFile(path.join(contentDir, file), 'utf8');
    const match = source.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!match) throw new Error(`Missing frontmatter in ${file}`);
    const { title, publishedAt, summary } = parse(match[1]);
    if (
      typeof title !== 'string' ||
      !(typeof publishedAt === 'string' || publishedAt instanceof Date) ||
      typeof summary !== 'string'
    ) {
      throw new Error(`Invalid feed metadata in ${file}`);
    }
    return {
      slug: path.basename(file, '.mdx'),
      title,
      publishedAt: publishedAt instanceof Date ? publishedAt.toISOString() : publishedAt,
      summary
    };
  })
);

posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
await fs.writeFile(outputPath, `${JSON.stringify(posts, null, 2)}\n`);

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const items = posts
  .map(
    (post) =>
      `  <item>\n    <title>${escapeXml(post.title)}</title>\n    <link>https://koenvangilst.nl/lab/${post.slug}</link>\n    <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>\n    <description>${escapeXml(post.summary)}</description>\n  </item>`
  )
  .join('\n');
const feed = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Koen van Gilst</title>\n    <link>https://koenvangilst.nl</link>\n    <description>Koen van Gilst</description>\n    <language>en</language>\n${items}\n  </channel>\n</rss>`;
const urls = [
  ...['', 'lab', 'photography'].map((page) => `<url><loc>https://koenvangilst.nl/${page}</loc></url>`),
  ...posts.map((post) => {
    const lastmod = new Date(post.publishedAt).toISOString();
    return `<url><loc>https://koenvangilst.nl/lab/${escapeXml(post.slug)}</loc><lastmod>${lastmod}</lastmod></url>`;
  })
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${urls.join('\n  ')}\n</urlset>`;
await Promise.all([
  fs.writeFile(path.join(process.cwd(), 'public/feed-fallback.xml'), feed),
  fs.writeFile(path.join(process.cwd(), 'public/sitemap-fallback.xml'), sitemap)
]);

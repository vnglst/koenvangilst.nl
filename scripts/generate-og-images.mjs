import fs from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const contentDir = path.join(process.cwd(), 'content');
const outputDir = path.join(process.cwd(), 'public/og');
const manifestPath = path.join(outputDir, '.manifest.json');

function sluggify(str) {
  return str.trim().toLowerCase().split(' ').join('-');
}

function parseFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const lines = match[1].split(/\r?\n/);
  const result = {};
  let currentKey = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();
    if (!trimmed) {
      currentKey = null;
      continue;
    }

    if (trimmed.startsWith('- ')) {
      if (currentKey) {
        const val = trimmed
          .slice(2)
          .trim()
          .replace(/^['"]|['"]$/g, '');
        if (!result[currentKey]) result[currentKey] = [];
        result[currentKey].push(val);
      }
    } else {
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx !== -1) {
        const key = trimmed.slice(0, colonIdx).trim();
        let value = trimmed.slice(colonIdx + 1).trim();

        if (value === '') {
          currentKey = key;
          result[key] = [];
        } else if (value.startsWith('[') && value.endsWith(']')) {
          result[key] = value
            .slice(1, -1)
            .split(',')
            .map((s) => s.trim().replace(/^['"]|['"]$/g, ''));
          currentKey = null;
        } else {
          value = value.replace(/^['"]|['"]$/g, '');
          result[key] = value;
          currentKey = null;
        }
      }
    }
  }
  return result;
}

function createOgElement(title, description, type) {
  return createElement(
    'div',
    {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: '80px'
      }
    },
    [
      createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
        createElement('div', {
          style: { width: '8px', height: '40px', backgroundColor: '#199acc', borderRadius: '4px' }
        }),
        createElement(
          'span',
          { style: { fontSize: 32, fontWeight: 600, color: '#199acc', letterSpacing: '-0.02em' } },
          'koenvangilst.nl'
        )
      ]),
      createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px' } }, [
        createElement(
          'h1',
          {
            style: {
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.1,
              color: '#1a1a1a',
              margin: 0,
              letterSpacing: '-0.03em'
            }
          },
          title
        ),
        createElement(
          'p',
          {
            style: {
              fontSize: 32,
              lineHeight: 1.4,
              color: '#666',
              margin: 0,
              fontWeight: 400
            }
          },
          description
        )
      ]),
      createElement('div', { style: { display: 'flex', alignItems: 'center' } }, [
        createElement(
          'span',
          {
            style: {
              fontSize: 24,
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }
          },
          type === 'tag' ? 'TAG' : 'BLOG POST'
        )
      ])
    ]
  );
}

function readManifest() {
  try {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch {
    return {};
  }
}

function writeManifest(manifest) {
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const previousManifest = readManifest();
  const nextManifest = {};

  const fontPath = path.join(process.cwd(), 'public/fonts/IBMPlexSans-Bold.ttf');
  if (!fs.existsSync(fontPath)) {
    console.error('Font not found:', fontPath);
    process.exit(1);
  }
  const fontData = fs.readFileSync(fontPath);

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.mdx'));
  const posts = [];
  const allTags = new Set();

  for (const file of files) {
    const slug = file.replace('.mdx', '');
    const fm = parseFrontmatter(path.join(contentDir, file));
    if (!fm.title || !fm.summary) continue;

    posts.push({ slug, title: fm.title, summary: fm.summary, tags: fm.tags || [] });
    if (Array.isArray(fm.tags)) {
      fm.tags.forEach((t) => allTags.add(t));
    }
  }

  const uniqueTags = [];
  const seenTagSlugs = new Set();
  for (const tag of allTags) {
    const tagSlug = sluggify(tag);
    if (seenTagSlugs.has(tagSlug)) continue;
    seenTagSlugs.add(tagSlug);
    uniqueTags.push(tag);
  }

  for (const post of posts) {
    const filename = `${post.slug}.png`;
    const signature = `blog\n${post.slug}\n${post.title}\n${post.summary}`;
    nextManifest[filename] = signature;

    if (previousManifest[filename] === signature && fs.existsSync(path.join(outputDir, filename))) {
      continue;
    }

    const svg = await satori(createOgElement(post.title, post.summary, 'blog'), {
      width: 1200,
      height: 630,
      fonts: [{ name: 'IBM Plex Sans', data: fontData, weight: 700, style: 'normal' }]
    });
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
    const pngData = resvg.render().asPng();
    fs.writeFileSync(path.join(outputDir, filename), Buffer.from(pngData));
    console.log(`Generated OG: og/${filename}`);
  }

  for (const tag of uniqueTags) {
    const tagPosts = posts.filter((p) => p.tags.includes(tag));
    const title = `Posts about ${tag}`;
    const description = `${tagPosts.length} post${tagPosts.length === 1 ? '' : 's'} about ${tag}`;
    const tagSlug = sluggify(tag);
    const filename = `tag-${tagSlug}.png`;
    const signature = `tag\n${tagSlug}\n${title}\n${description}`;
    nextManifest[filename] = signature;

    if (previousManifest[filename] === signature && fs.existsSync(path.join(outputDir, filename))) {
      continue;
    }

    const svg = await satori(createOgElement(title, description, 'tag'), {
      width: 1200,
      height: 630,
      fonts: [{ name: 'IBM Plex Sans', data: fontData, weight: 700, style: 'normal' }]
    });
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
    const pngData = resvg.render().asPng();
    fs.writeFileSync(path.join(outputDir, filename), Buffer.from(pngData));
    console.log(`Generated OG: og/${filename}`);
  }

  for (const file of fs.readdirSync(outputDir)) {
    if (!file.endsWith('.png')) continue;
    if (nextManifest[file]) continue;
    fs.rmSync(path.join(outputDir, file));
  }

  writeManifest(nextManifest);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { createHomeOgImage, createPostOgImage, createTagOgImage } from '../src/lib/og-image.mjs';

const contentDir = path.join(process.cwd(), 'content');
const outputDir = process.env.OG_OUTPUT_DIR || path.join(process.cwd(), 'public/og');
const manifestPath = path.join(outputDir, '.manifest.json');
const fontsDir = path.join(process.cwd(), 'public/fonts');
const avatarPath = path.join(process.cwd(), 'public/avatar.jpg');
const fontPath = path.join(fontsDir, 'IBMPlexSans-Bold.ttf');

function toDataUrl(filePath, mime = 'image/jpeg') {
  return `data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}`;
}

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

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text, maxChars, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);
  if (lines.length <= maxLines) return lines;

  const trimmed = lines.slice(0, maxLines);
  trimmed[maxLines - 1] = `${trimmed[maxLines - 1].replace(/\s+$/, '')}...`;
  return trimmed;
}

function renderTextBlock(lines, x, startY, lineHeight, fontSize, fill, weight) {
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${startY + index * lineHeight}" fill="${fill}" font-family="IBM Plex Sans, sans-serif" font-size="${fontSize}" font-weight="${weight}" dominant-baseline="hanging">${escapeXml(line)}</text>`
    )
    .join('\n');
}

function createOgSvg(title, description, type, avatarDataUrl, fontDataUrl) {
  const badgeLabel = type === 'tag' ? 'Tag' : type === 'home' ? 'Home' : 'Blog post';
  const titleLines = wrapText(title, 22, 3);
  const descriptionLines = wrapText(description, 58, titleLines.length >= 3 ? 2 : 3);
  const titleHeight = titleLines.length * 78;
  const descriptionY = 226 + titleHeight;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'IBM Plex Sans';
        src: url('${fontDataUrl}') format('truetype');
        font-weight: 400;
        font-style: normal;
      }
      @font-face {
        font-family: 'IBM Plex Sans';
        src: url('${fontDataUrl}') format('truetype');
        font-weight: 700;
        font-style: normal;
      }
    </style>
    <clipPath id="avatar-clip" clipPathUnits="userSpaceOnUse">
      <circle cx="44" cy="44" r="32" />
    </clipPath>
    <linearGradient id="canvas" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#020617" />
      <stop offset="0.58" stop-color="#0f172a" />
      <stop offset="1" stop-color="#020617" />
    </linearGradient>
    <radialGradient id="blue-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(973 123) rotate(139) scale(520 360)">
      <stop stop-color="#2196f3" stop-opacity="0.42" />
      <stop offset="0.45" stop-color="#2196f3" stop-opacity="0.11" />
      <stop offset="1" stop-color="#2196f3" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#canvas)" />
  <rect width="1200" height="630" fill="url(#blue-glow)" />
  <rect x="56" y="560" width="1088" height="2" rx="1" fill="#1e293b" />
  <rect x="56" y="560" width="184" height="2" rx="1" fill="#2196f3" />
  <g transform="translate(56 54)">
    <rect x="0" y="0" width="342" height="88" rx="44" fill="#0f172a" fill-opacity="0.78" stroke="#334155" />
    <circle cx="44" cy="44" r="34" fill="#020617" stroke="#2196f3" stroke-width="2" />
    <image href="${avatarDataUrl}" x="12" y="12" width="64" height="64" clip-path="url(#avatar-clip)" preserveAspectRatio="xMidYMid slice" />
    <text x="96" y="22" fill="#f8fafc" font-family="IBM Plex Sans, sans-serif" font-size="18" font-weight="700" letter-spacing="0.035em" dominant-baseline="hanging">Koen van Gilst</text>
    <text x="96" y="49" fill="#94a3b8" font-family="IBM Plex Sans, sans-serif" font-size="14" font-weight="400" dominant-baseline="hanging">koenvangilst.nl</text>
  </g>
  <g transform="translate(970 64)">
    <rect x="0" y="0" width="150" height="38" rx="19" fill="#020617" fill-opacity="0.68" stroke="#334155" />
    <text x="75" y="12" text-anchor="middle" fill="#64b5f6" font-family="IBM Plex Sans, sans-serif" font-size="12" font-weight="700" letter-spacing="0.15em" dominant-baseline="hanging">${badgeLabel.toUpperCase()}</text>
  </g>
  <g transform="translate(56 226)">
    <text x="0" y="-46" fill="#2196f3" font-family="IBM Plex Sans, sans-serif" font-size="16" font-weight="700" letter-spacing="0.18em" dominant-baseline="hanging">WRITING / SOFTWARE / SYSTEMS</text>
    ${renderTextBlock(titleLines, 0, 0, 78, 70, '#f8fafc', 700)}
    ${renderTextBlock(descriptionLines, 0, descriptionY - 226 + 26, 39, 28, '#cbd5e1', 400)}
  </g>
</svg>`;
}

function readManifest() {
  try {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch {
    return {};
  }
}

function writeManifest(manifest) {
  writeFileAtomically(manifestPath, Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`));
}

function writeFileAtomically(filePath, contents) {
  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  fs.writeFileSync(temporaryPath, contents);
  fs.renameSync(temporaryPath, filePath);
}

function renderOgImage(image, type, avatarDataUrl, fontDataUrl) {
  const outputPath = path.join(outputDir, image.filename);
  const svg = createOgSvg(image.title, image.description, type, avatarDataUrl, fontDataUrl);
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  writeFileAtomically(outputPath, Buffer.from(resvg.render().asPng()));
  console.log(`Generated OG: ${image.url}`);
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const previousManifest = readManifest();
  // Keep historical entries because their immutable URLs may still be in use.
  const nextManifest = { ...previousManifest };

  const requiredFonts = ['IBMPlexSans-Bold.ttf'];

  for (const fontFile of requiredFonts) {
    const fontPath = path.join(fontsDir, fontFile);
    if (!fs.existsSync(fontPath)) {
      console.error('Font not found:', fontPath);
      process.exit(1);
    }
  }

  const avatarDataUrl = fs.existsSync(avatarPath) ? toDataUrl(avatarPath) : null;
  if (!avatarDataUrl) {
    console.error('Avatar not found:', avatarPath);
    process.exit(1);
  }

  const fontDataUrl = toDataUrl(fontPath, 'font/ttf');

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.mdx'));
  const posts = [];
  const allTags = new Set();

  const homeImage = createHomeOgImage();
  nextManifest[homeImage.filename] = homeImage.signature;

  if (
    !(
      previousManifest[homeImage.filename] === homeImage.signature &&
      fs.existsSync(path.join(outputDir, homeImage.filename))
    )
  ) {
    renderOgImage(homeImage, 'home', avatarDataUrl, fontDataUrl);
  }

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
    const image = createPostOgImage({ slug: post.slug, title: post.title, description: post.summary });
    nextManifest[image.filename] = image.signature;

    if (previousManifest[image.filename] === image.signature && fs.existsSync(path.join(outputDir, image.filename))) {
      continue;
    }

    renderOgImage(image, 'blog', avatarDataUrl, fontDataUrl);
  }

  for (const tag of uniqueTags) {
    const tagPosts = posts.filter((p) => p.tags.includes(tag));
    const tagSlug = sluggify(tag);
    const image = createTagOgImage({ slug: tagSlug, tag, postCount: tagPosts.length });
    nextManifest[image.filename] = image.signature;

    if (previousManifest[image.filename] === image.signature && fs.existsSync(path.join(outputDir, image.filename))) {
      continue;
    }

    renderOgImage(image, 'tag', avatarDataUrl, fontDataUrl);
  }

  writeManifest(nextManifest);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

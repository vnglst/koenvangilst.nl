import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const contentDir = path.join(process.cwd(), 'content');
const outputDir = path.join(process.cwd(), 'public/og');
const manifestPath = path.join(outputDir, '.manifest.json');
const fontsDir = path.join(process.cwd(), 'public/fonts');
const avatarPath = path.join(process.cwd(), 'public/avatar.jpg');
const fontPath = path.join(fontsDir, 'IBMPlexSans-Bold.ttf');
const ogVersion = 'v5-dark-minimal';

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
  const titleLines = wrapText(title, 24, 3);
  const descriptionLines = wrapText(description, 54, 3);
  const titleHeight = titleLines.length * 74;
  const descriptionY = 230 + titleHeight;

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
    <clipPath id="avatar-clip">
      <circle cx="20" cy="20" r="20" />
    </clipPath>
  </defs>
  <rect width="1200" height="630" fill="#020617" />
  <rect x="56" y="574" width="1088" height="3" rx="1.5" fill="#2196f3" />
  <g transform="translate(56 56)">
    <circle cx="20" cy="20" r="20" fill="none" stroke="#2196f3" stroke-width="2" />
    <image href="${avatarDataUrl}" x="0" y="0" width="40" height="40" clip-path="url(#avatar-clip)" preserveAspectRatio="xMidYMid slice" />
    <text x="56" y="0" fill="#f8fafc" font-family="IBM Plex Sans, sans-serif" font-size="16" font-weight="700" letter-spacing="0.04em" dominant-baseline="hanging">koenvangilst.nl</text>
    <text x="56" y="20" fill="#94a3b8" font-family="IBM Plex Sans, sans-serif" font-size="13" font-weight="400" dominant-baseline="hanging">Tech Lead at Rabobank</text>
    <g transform="translate(1000 0)">
      <rect x="0" y="0" width="144" height="36" rx="18" fill="rgba(15, 23, 42, 0.85)" stroke="#334155" />
      <text x="72" y="11" text-anchor="middle" fill="#2196f3" font-family="IBM Plex Sans, sans-serif" font-size="12" font-weight="700" letter-spacing="0.14em" dominant-baseline="hanging">${badgeLabel.toUpperCase()}</text>
    </g>
  </g>
  <g transform="translate(56 230)">
    ${renderTextBlock(titleLines, 0, 0, 74, 68, '#f8fafc', 700)}
    ${renderTextBlock(descriptionLines, 0, descriptionY - 230 + 28, 42, 30, '#cbd5e1', 400)}
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
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const previousManifest = readManifest();
  const nextManifest = {};

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

  const homeTitle = 'Koen van Gilst';
  const homeDescription =
    'Principal Engineer at Rabobank with a background in philosophy and lifelong passion for programming.';

  const homeFilename = 'home.png';
  const homeSignature = `${ogVersion}\nhome\n${homeTitle}\n${homeDescription}`;
  nextManifest[homeFilename] = homeSignature;

  if (!(previousManifest[homeFilename] === homeSignature && fs.existsSync(path.join(outputDir, homeFilename)))) {
    const svg = createOgSvg(homeTitle, homeDescription, 'home', avatarDataUrl, fontDataUrl);
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
    const pngData = resvg.render().asPng();
    fs.writeFileSync(path.join(outputDir, homeFilename), Buffer.from(pngData));
    console.log(`Generated OG: og/${homeFilename}`);
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
    const filename = `${post.slug}.png`;
    const signature = `${ogVersion}\nblog\n${post.slug}\n${post.title}\n${post.summary}`;
    nextManifest[filename] = signature;

    if (previousManifest[filename] === signature && fs.existsSync(path.join(outputDir, filename))) {
      continue;
    }

    const svg = createOgSvg(post.title, post.summary, 'blog', avatarDataUrl, fontDataUrl);
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
    const signature = `${ogVersion}\ntag\n${tagSlug}\n${title}\n${description}`;
    nextManifest[filename] = signature;

    if (previousManifest[filename] === signature && fs.existsSync(path.join(outputDir, filename))) {
      continue;
    }

    const svg = createOgSvg(title, description, 'tag', avatarDataUrl, fontDataUrl);
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

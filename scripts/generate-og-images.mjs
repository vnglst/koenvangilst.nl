import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { createFallbackOgImage, createHomeOgImage, createPostOgImage, createTagOgImage } from '../src/lib/og-image.mjs';

const watchMode = process.argv.includes('--watch');
const skipInitial = process.argv.includes('--skip-initial');
const contentDir = path.join(process.cwd(), 'content');
const outputDir = process.env.OG_OUTPUT_DIR || path.join(process.cwd(), 'public/og');
const manifestPath = path.join(outputDir, '.manifest.json');
const fontsDir = path.join(process.cwd(), 'public/fonts');
const fontPath = path.join(fontsDir, 'IBMPlexSans-Regular.ttf');
const displayFontPath = path.join(fontsDir, 'NimbusSansExtended-Bold.otf');
const portraitPath = path.join(process.cwd(), 'public/avatar.jpg');
const watchFiles = [path.join(process.cwd(), 'src/lib/og-image.mjs'), fontPath, displayFontPath, portraitPath];

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

function renderTextBlock(lines, x, startY, lineHeight, fontSize, fill, family = 'IBM Plex Sans', weight = 400) {
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${startY + index * lineHeight}" fill="${fill}" font-family="${family}" font-size="${fontSize}" font-weight="${weight}">${escapeXml(line)}</text>`
    )
    .join('\n');
}

function createOgSvg(title, description, type) {
  const isHome = type === 'home' || type === 'fallback';
  const titleLines = isHome ? [title] : wrapText(title, 26, 5);
  const titleY = isHome ? 170 : 100;
  const descriptionY = isHome ? 270 : titleY + titleLines.length * 58 + 28;
  const descriptionLines = wrapText(description, 58, isHome ? 4 : 3);
  const portrait = fs.readFileSync(portraitPath).toString('base64');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="portrait"><circle cx="120" cy="130" r="40" /></clipPath></defs>
  <rect width="1200" height="630" fill="#020617" />
  <image x="80" y="90" width="80" height="80" clip-path="url(#portrait)" href="data:image/jpeg;base64,${portrait}" />
  ${renderTextBlock(titleLines, 280, titleY, 58, isHome ? 54 : 46, '#e5e7eb', 'Nimbus Sans D OT', 700)}
  ${renderTextBlock(descriptionLines, 280, descriptionY, 34, 24, '#9ca3af')}
  <text x="280" y="560" fill="#42a5f5" font-family="IBM Plex Sans" font-size="22">koenvangilst.nl</text>
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

function renderOgImage(image, type) {
  const outputPath = path.join(outputDir, image.filename);
  const svg = createOgSvg(image.title, image.description, type);
  const resvg = new Resvg(svg, {
    font: {
      defaultFontFamily: 'IBM Plex Sans',
      fontFiles: [fontPath, displayFontPath],
      loadSystemFonts: false
    }
  });
  const rendered = resvg.render();
  writeFileAtomically(outputPath, rendered.asPng());
  console.log(`Generated OG: ${image.url}`);
}

async function main() {
  if (watchMode) {
    await runWatchMode();
    return;
  }

  await generateOgImages();
}

async function generateOgImages() {
  fs.mkdirSync(outputDir, { recursive: true });
  const previousManifest = readManifest();
  // Keep historical entries because their immutable URLs may still be in use.
  const nextManifest = { ...previousManifest };

  const requiredFonts = ['IBMPlexSans-Regular.ttf', 'NimbusSansExtended-Bold.otf'];

  for (const fontFile of requiredFonts) {
    const fontPath = path.join(fontsDir, fontFile);
    if (!fs.existsSync(fontPath)) {
      console.error('Font not found:', fontPath);
      process.exit(1);
    }
  }

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.mdx'));
  const posts = [];
  const allTags = new Set();

  const renderIfNeeded = (image, type) => {
    nextManifest[image.filename] = image.signature;
    if (previousManifest[image.filename] !== image.signature || !fs.existsSync(path.join(outputDir, image.filename))) {
      renderOgImage(image, type);
    }
  };

  renderOgImage(createFallbackOgImage(), 'fallback');
  renderIfNeeded(createHomeOgImage(), 'home');

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
    renderIfNeeded(image, 'blog');
  }

  for (const tag of uniqueTags) {
    const tagPosts = posts.filter((p) => p.tags.includes(tag));
    const tagSlug = sluggify(tag);
    const image = createTagOgImage({ slug: tagSlug, tag, postCount: tagPosts.length });
    renderIfNeeded(image, 'tag');
  }

  writeManifest(nextManifest);
}

async function runWatchMode() {
  if (!skipInitial) {
    await generateOgImages();
  }

  console.log('Watching OG image inputs for changes...');

  let running = false;
  let rerunQueued = false;
  let debounceTimer = null;

  const readContentSnapshot = () => {
    const snapshot = new Map();
    for (const filename of fs.readdirSync(contentDir).filter((file) => file.endsWith('.mdx'))) {
      const stats = fs.statSync(path.join(contentDir, filename));
      snapshot.set(filename, `${stats.mtimeMs}:${stats.size}`);
    }
    return snapshot;
  };

  let contentSnapshot = readContentSnapshot();

  const scheduleRerun = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      void rerun();
    }, 150);
  };

  const rerun = async () => {
    if (running) {
      rerunQueued = true;
      return;
    }

    running = true;
    try {
      await generateOgImages();
    } catch (err) {
      console.error(err);
    } finally {
      running = false;
      if (rerunQueued) {
        rerunQueued = false;
        await rerun();
      }
    }
  };

  const contentPoller = setInterval(() => {
    const nextSnapshot = readContentSnapshot();
    const changed =
      nextSnapshot.size !== contentSnapshot.size ||
      [...nextSnapshot].some(([filename, signature]) => contentSnapshot.get(filename) !== signature);
    contentSnapshot = nextSnapshot;
    if (changed) scheduleRerun();
  }, 1000);

  for (const filePath of watchFiles) {
    fs.watchFile(filePath, { interval: 1000 }, scheduleRerun);
  }

  const shutdown = () => {
    clearInterval(contentPoller);

    for (const filePath of watchFiles) {
      fs.unwatchFile(filePath, scheduleRerun);
    }

    process.exit(0);
  };

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);

  await new Promise(() => {});
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

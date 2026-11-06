import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { parse } from 'yaml';
import { createFallbackOgImage, createHomeOgImage, createPostOgImage, createTagOgImage } from '../src/lib/og-image.mjs';
import { getOgSourcePath, readOgSource } from '../src/lib/og-source.ts';

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
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  return match ? (parse(match[1]) ?? {}) : {};
}

function readPosts() {
  const posts = [];
  for (const file of fs.readdirSync(contentDir).filter((filename) => filename.endsWith('.mdx'))) {
    const { title, summary, tags, image } = parseFrontmatter(path.join(contentDir, file));
    if (!title || !summary) continue;
    posts.push({ slug: file.slice(0, -4), title, summary, tags: tags ?? [], image });
  }
  return posts;
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

async function createFeaturedOgSvg(title, bytes) {
  const source = sharp(bytes).autoOrient();
  const {
    autoOrient: { width, height }
  } = await source.metadata();
  // Keep the edges of wide comparisons and screenshots visible.
  const panoramic = width / height > 2.4;
  const background = await source
    .clone()
    .resize(1200, 630, { fit: panoramic ? 'inside' : 'cover' })
    .png()
    .toBuffer();
  const backdrop = panoramic ? await source.resize(120, 63).blur(4).jpeg().toBuffer() : undefined;
  const titleLines = wrapText(title, 30, 5);
  const shadeEnd = Math.min(630, 180 + titleLines.length * 62);

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${shadeEnd}">
      <stop offset="0" stop-color="#020617" stop-opacity=".94" />
      <stop offset=".55" stop-color="#020617" stop-opacity=".79" />
      <stop offset="1" stop-color="#020617" stop-opacity="0" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#020617" />
  ${backdrop ? `<image width="1200" height="630" opacity=".35" href="data:image/jpeg;base64,${backdrop.toString('base64')}" />` : ''}
  <image width="1200" height="630" preserveAspectRatio="xMidYMax meet" href="data:image/png;base64,${background.toString('base64')}" />
  <rect width="1200" height="630" fill="url(#shade)" />
  <text x="72" y="70" fill="#e5e7eb" font-family="IBM Plex Sans" font-size="24">koenvangilst.nl</text>
  ${renderTextBlock(titleLines, 72, 138, 62, 56, '#ffffff', 'Nimbus Sans D OT', 700)}
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

async function renderOgImage(image, type, bytes, titleInImage) {
  const outputPath = path.join(outputDir, image.filename);
  let png;
  let svg;
  if (bytes) {
    try {
      if (titleInImage) {
        png = await sharp(bytes)
          .autoOrient()
          .resize(1200, 630, { fit: 'contain', background: '#020617' })
          .png()
          .toBuffer();
      } else {
        svg = await createFeaturedOgSvg(image.title, bytes);
      }
    } catch (error) {
      console.warn(`Could not render featured image for ${image.filename}: ${error.message}`);
    }
  }
  if (!png) {
    const resvg = new Resvg(svg ?? createOgSvg(image.title, image.description, type), {
      font: {
        defaultFontFamily: 'IBM Plex Sans',
        fontFiles: [fontPath, displayFontPath],
        loadSystemFonts: false
      }
    });
    png = resvg.render().asPng();
  }
  writeFileAtomically(outputPath, png);
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

  const posts = readPosts();
  const allTags = new Set(posts.flatMap((post) => post.tags));

  const renderIfNeeded = async (image, type, bytes, titleInImage) => {
    nextManifest[image.filename] = image.signature;
    if (previousManifest[image.filename] !== image.signature || !fs.existsSync(path.join(outputDir, image.filename))) {
      await renderOgImage(image, type, bytes, titleInImage);
    }
  };

  await renderOgImage(createFallbackOgImage(), 'fallback');
  await renderIfNeeded(createHomeOgImage(), 'home');

  const uniqueTags = [];
  const seenTagSlugs = new Set();
  for (const tag of allTags) {
    const tagSlug = sluggify(tag);
    if (seenTagSlugs.has(tagSlug)) continue;
    seenTagSlugs.add(tagSlug);
    uniqueTags.push(tag);
  }

  for (const post of posts) {
    const source = readOgSource(post.image?.src);
    const image = createPostOgImage({
      slug: post.slug,
      title: post.title,
      description: post.summary,
      imageDigest: source?.digest,
      titleInImage: post.image?.titleInImage
    });
    await renderIfNeeded(image, 'blog', source?.bytes, post.image?.titleInImage);
  }

  for (const tag of uniqueTags) {
    const tagPosts = posts.filter((p) => p.tags.includes(tag));
    const tagSlug = sluggify(tag);
    const image = createTagOgImage({ slug: tagSlug, tag, postCount: tagPosts.length });
    await renderIfNeeded(image, 'tag');
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

  const readSnapshot = (files) => {
    const snapshot = new Map();
    for (const file of files) {
      const stats = fs.statSync(file, { throwIfNoEntry: false });
      if (stats) snapshot.set(file, `${stats.mtimeMs}:${stats.size}`);
    }
    return snapshot;
  };
  const readContentSnapshot = () =>
    readSnapshot(
      fs
        .readdirSync(contentDir)
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => path.join(contentDir, file))
    );
  const readSourcePaths = () =>
    readPosts()
      .map((post) => getOgSourcePath(post.image?.src))
      .filter(Boolean);
  const hasChanged = (previous, next) =>
    next.size !== previous.size || [...next].some(([file, signature]) => previous.get(file) !== signature);

  let contentSnapshot = readContentSnapshot();
  let sourcePaths = readSourcePaths();
  let sourceSnapshot = readSnapshot(sourcePaths);

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
    try {
      const nextContent = readContentSnapshot();
      const contentChanged = hasChanged(contentSnapshot, nextContent);
      if (contentChanged) sourcePaths = readSourcePaths();
      const nextSources = readSnapshot(sourcePaths);
      if (contentChanged || hasChanged(sourceSnapshot, nextSources)) scheduleRerun();
      contentSnapshot = nextContent;
      sourceSnapshot = nextSources;
    } catch (error) {
      console.error(error);
    }
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

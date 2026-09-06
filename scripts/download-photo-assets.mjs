import fs from 'node:fs/promises';
import path from 'node:path';

const manifestPath = path.join(process.cwd(), 'public/photos-data.json');
const outputDir = path.join(process.cwd(), 'public/photos');
const sourceUrl = (process.env.PHOTOS_SOURCE_URL || 'https://koenvangilst.nl').replace(/\/$/, '');

function photoPaths(photo) {
  const candidates = [photo.src, photo.srcSet, photo.srcSetWebp].filter(Boolean).flatMap((value) =>
    String(value)
      .split(',')
      .map((part) => part.trim().split(/\s+/, 1)[0])
  );
  return [...new Set(candidates)];
}

function localPath(assetPath) {
  if (!assetPath.startsWith('/photos/')) throw new Error(`Unexpected photo asset path: ${assetPath}`);
  const filename = assetPath.slice('/photos/'.length);
  if (!filename || filename.includes('/') || filename.includes('..'))
    throw new Error(`Unsafe photo asset path: ${assetPath}`);
  return path.join(outputDir, filename);
}

const photos = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const assets = [...new Set(photos.flatMap(photoPaths))];
await fs.mkdir(outputDir, { recursive: true });

for (const assetPath of assets) {
  const destination = localPath(assetPath);
  try {
    const stat = await fs.stat(destination);
    if (stat.size > 0) continue;
  } catch {}

  const response = await fetch(`${sourceUrl}${assetPath}`);
  if (!response.ok || !response.body) throw new Error(`Unable to download ${assetPath}: ${response.status}`);
  await fs.writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

console.log(`Validated ${assets.length} photography assets from ${photos.length} photos.`);

/**
 * Pre-generates photo metadata (EXIF, srcSet, blur placeholders) at deploy time.
 * Output: public/static/photos-data.json
 *
 * Run after generate-images.mjs so all optimized sizes already exist.
 * The JSON is loaded at runtime in src/lib/photos.ts — just a fast JSON.parse, no sharp.
 */

import exifReader from 'exif-reader';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIDTHS = [384, 640, 750, 828, 1080, 1200, 1920, 2048, 2400];
const PHOTOS_DIR = path.join(__dirname, '../public/static/photography');
const OPTIMIZED_DIR = path.join(__dirname, '../public/static/photography-optimized');
const OUTPUT_FILE = path.join(__dirname, '../public/static/photos-data.json');

function sanitizeName(name) {
  return name.replace(/,\s*/g, '-').replace(/\s+/g, '-').replace(/-+/g, '-');
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function generatePhotosData() {
  console.log('📸 Generating photo metadata...');

  let files = await fs.readdir(PHOTOS_DIR);
  files = files.filter((f) => /\.(jpg|jpeg)$/i.test(f));
  console.log(`Found ${files.length} source images`);

  const filesWithStats = await Promise.all(
    files.map(async (filename) => {
      const stats = await fs.stat(path.join(PHOTOS_DIR, filename));
      return { filename, createTime: stats.birthtime };
    })
  );

  const photos = await Promise.all(
    filesWithStats.map(async (file, index) => {
      const filePath = path.join(PHOTOS_DIR, file.filename);
      const image = sharp(filePath);
      const metadata = await image.metadata();
      const nameWithoutExt = file.filename.replace(/\.[^/.]+$/, '');
      const location = nameWithoutExt.split('-')[0];
      const safeName = sanitizeName(nameWithoutExt);
      const imageDir = path.join(OPTIMIZED_DIR, safeName);
      const aspectRatio = (metadata.width || 0) / (metadata.height || 0);

      // EXIF date
      let createdAt;
      if (metadata.exif) {
        try {
          const exif = exifReader(metadata.exif);
          const dt = exif.Photo?.DateTimeOriginal;
          if (dt) createdAt = dt instanceof Date ? dt.toISOString() : String(dt);
        } catch {}
      }
      if (!createdAt) createdAt = file.createTime.toISOString();

      // Build srcSet entries for JPEG and WebP
      const srcSetJpegParts = [];
      const srcSetWebpParts = [];
      for (const width of WIDTHS) {
        if (width > (metadata.width || 0)) continue;
        if (await fileExists(path.join(imageDir, `${width}.jpg`))) {
          srcSetJpegParts.push(`/static/photography-optimized/${safeName}/${width}.jpg ${width}w`);
        }
        if (await fileExists(path.join(imageDir, `${width}.webp`))) {
          srcSetWebpParts.push(`/static/photography-optimized/${safeName}/${width}.webp ${width}w`);
        }
      }
      srcSetJpegParts.push(`/static/photography-optimized/${safeName}/original.jpg ${metadata.width || 0}w`);
      srcSetWebpParts.push(`/static/photography-optimized/${safeName}/original.webp ${metadata.width || 0}w`);

      // Tiny blur placeholder (10px wide, base64)
      const blurBuffer = await sharp(filePath)
        .resize(10, 10, { fit: 'inside' })
        .jpeg({ quality: 70 })
        .toBuffer();

      console.log(`  ✓ ${file.filename}`);
      return {
        id: index,
        filename: file.filename,
        src: `/static/photography-optimized/${safeName}/original.jpg`,
        srcSet: srcSetJpegParts.join(', '),
        srcSetWebp: srcSetWebpParts.join(', '),
        alt: location,
        width: metadata.width || 0,
        height: metadata.height || 0,
        isVertical: aspectRatio < 1,
        createdAt,
        location,
        blurDataURL: `data:image/jpeg;base64,${blurBuffer.toString('base64')}`,
      };
    })
  );

  // Sort newest first (same as runtime lib)
  photos.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  photos.forEach((p, i) => { p.id = i; });

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(photos, null, 2));
  console.log(`✅ Photo metadata written to ${path.relative(process.cwd(), OUTPUT_FILE)}`);
  console.log(`   ${photos.length} photos`);
}

generatePhotosData().catch((err) => {
  console.error('Error generating photo data:', err);
  process.exit(1);
});

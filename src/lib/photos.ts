import exifReader from 'exif-reader';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

import type { PhotoType } from '#/data/photos';

const WIDTHS = [384, 640, 750, 828, 1080, 1200, 1920, 2048, 2400];

/** Convert a photo base name to a URL-safe directory name (must match generate-images.mjs) */
function sanitizeName(name: string): string {
  return name.replace(/,\s*/g, '-').replace(/\s+/g, '-').replace(/-+/g, '-');
}

let cachedPhotos: PhotoType[] | null = null;
let cacheTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function getPhotos(): Promise<PhotoType[]> {
  if (cachedPhotos && Date.now() - cacheTime < CACHE_DURATION) return cachedPhotos;

  const photosDir = path.join(process.cwd(), 'public/static/photography');
  const optimizedDir = path.join(process.cwd(), 'public/static/photography-optimized');

  let files = await fs.readdir(photosDir);
  files = files.filter((f) => /\.(jpg|jpeg)$/i.test(f));

  const filesWithStats = await Promise.all(
    files.map(async (filename) => {
      const stats = await fs.stat(path.join(photosDir, filename));
      return { filename, createTime: stats.birthtime };
    })
  );

  const photosWithData = await Promise.all(
    filesWithStats.map(async (file) => {
      const filePath = path.join(photosDir, file.filename);
      const image = sharp(filePath);
      const metadata = await image.metadata();
      const aspectRatio = (metadata.width || 0) / (metadata.height || 0);
      const nameWithoutExt = file.filename.replace(/\.[^/.]+$/, '');
      const location = nameWithoutExt.split('-')[0];

      let createdAt: string | undefined;
      if (metadata.exif) {
        try {
          const exif = exifReader(metadata.exif);
          const dt = exif.Photo?.DateTimeOriginal;
          if (dt) createdAt = dt instanceof Date ? dt.toISOString() : String(dt);
        } catch {}
      }
      if (!createdAt) createdAt = file.createTime.toISOString();

      const safeName = sanitizeName(nameWithoutExt);
      const imageDir = path.join(optimizedDir, safeName);
      const srcSetJpegParts: string[] = [];
      const srcSetWebpParts: string[] = [];

      for (const width of WIDTHS) {
        if (width > (metadata.width || 0)) continue;
        try {
          await fs.access(path.join(imageDir, `${width}.jpg`));
          srcSetJpegParts.push(`/static/photography-optimized/${safeName}/${width}.jpg ${width}w`);
        } catch {}
        try {
          await fs.access(path.join(imageDir, `${width}.webp`));
          srcSetWebpParts.push(`/static/photography-optimized/${safeName}/${width}.webp ${width}w`);
        } catch {}
      }
      srcSetJpegParts.push(`/static/photography-optimized/${safeName}/original.jpg ${metadata.width || 0}w`);
      srcSetWebpParts.push(`/static/photography-optimized/${safeName}/original.webp ${metadata.width || 0}w`);

      const blurBuffer = await sharp(filePath).resize(10, 10, { fit: 'inside' }).jpeg({ quality: 70 }).toBuffer();

      return {
        id: 0,
        filename: file.filename,
        src: `/static/photography-optimized/${safeName}/original.jpg`,
        srcSet: srcSetJpegParts.join(', '),
        srcSetWebp: srcSetWebpParts.join(', '),
        width: metadata.width || 0,
        height: metadata.height || 0,
        alt: location,
        isVertical: aspectRatio < 1,
        createdAt,
        location,
        blurDataURL: `data:image/jpeg;base64,${blurBuffer.toString('base64')}`
      };
    })
  );

  photosWithData.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  const photos: PhotoType[] = photosWithData.map((p, idx) => ({ ...p, id: idx }));
  cachedPhotos = photos;
  cacheTime = Date.now();
  return photos;
}

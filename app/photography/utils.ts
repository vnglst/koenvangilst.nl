import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export async function getPhotos() {
  const photosDirectory = path.join(process.cwd(), 'public/static/photography');
  const files = await fs.readdir(photosDirectory);

  // sort files on filename, but reverse the order
  files.sort().reverse();

  const photos = await Promise.all(
    files.map(async (filename) => {
      const filePath = path.join(photosDirectory, filename);
      const metadata = await sharp(filePath).metadata();
      const aspectRatio = (metadata.width || 0) / (metadata.height || 0);

      return {
        src: `/static/photography/${filename}`,
        width: metadata.width || 0,
        height: metadata.height || 0,
        alt: filename.replace(/\.[^/.]+$/, ''),
        isVertical: aspectRatio < 1
      };
    })
  );

  return photos;
}

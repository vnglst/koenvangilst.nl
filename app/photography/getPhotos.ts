import exifReader from 'exif-reader';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export type PhotoType = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  isVertical: boolean;
  createdAt?: Date;
  location?: string;
  blurDataURL: string;
};

export async function getPhotos(): Promise<PhotoType[]> {
  const photosDirectory = path.join(process.cwd(), 'public/static/photography');
  let files = await fs.readdir(photosDirectory);

  files = files.filter((filename) => /\.(jpg|jpeg)$/.test(filename));

  const filesWithStats = await Promise.all(
    files.map(async (filename) => {
      const filePath = path.join(photosDirectory, filename);
      const stats = await fs.stat(filePath);
      return { filename, createTime: stats.birthtime };
    })
  );

  const photos = await Promise.all(
    filesWithStats.map(async (file) => {
      const filePath = path.join(photosDirectory, file.filename);
      const image = sharp(filePath);
      const metadata = await image.metadata();
      const aspectRatio = (metadata.width || 0) / (metadata.height || 0);
      const id = encodeURIComponent(file.filename);
      const location = file.filename.replace(/\.[^/.]+$/, '').split('-')[0];

      let createdAt: Date | undefined;

      if (metadata.exif) {
        try {
          const exif = exifReader(metadata.exif);
          createdAt = exif.Photo?.DateTimeOriginal;
        } catch (error) {
          console.error(`Error parsing EXIF data for ${file.filename}:`, error);
        }
      }

      return {
        id,
        src: `/static/photography/${encodeURIComponent(file.filename)}`,
        width: metadata.width || 0,
        height: metadata.height || 0,
        alt: location,
        isVertical: aspectRatio < 1,
        createdAt: createdAt || file.createTime,
        location,
        blurDataURL: await getBlurDataURL(filePath)
      };
    })
  );

  // Sort photos by createdAt date
  photos.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));

  return photos;
}

async function getBlurDataURL(imagePath: string) {
  const buffer = await sharp(imagePath).resize(8, 8, { fit: 'inside' }).toBuffer();
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

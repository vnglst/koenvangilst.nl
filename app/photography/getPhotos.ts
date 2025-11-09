import exifReader from 'exif-reader';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export type PhotoType = {
  id: number; // Index-based ID for simple routing
  filename: string;
  src: string;
  srcSet: string;
  alt: string;
  width: number;
  height: number;
  isVertical: boolean;
  createdAt?: Date;
  location?: string;
  blurDataURL: string;
};

const WIDTHS = [384, 640, 750, 828, 1080, 1200, 1920, 2048, 2400];

export async function getPhotos(): Promise<PhotoType[]> {
  const photosDirectory = path.join(process.cwd(), 'public/static/photography');
  const optimizedDirectory = path.join(process.cwd(), 'public/static/photography-optimized');

  let files = await fs.readdir(photosDirectory);
  files = files.filter((filename) => /\.(jpg|jpeg)$/.test(filename));

  const filesWithStats = await Promise.all(
    files.map(async (filename) => {
      const filePath = path.join(photosDirectory, filename);
      const stats = await fs.stat(filePath);
      return { filename, createTime: stats.birthtime };
    })
  );

  const photosWithData = await Promise.all(
    filesWithStats.map(async (file) => {
      const filePath = path.join(photosDirectory, file.filename);
      const image = sharp(filePath);
      const metadata = await image.metadata();
      const aspectRatio = (metadata.width || 0) / (metadata.height || 0);
      const location = file.filename.replace(/\.[^/.]+$/, '').split('-')[0];
      const nameWithoutExt = file.filename.replace(/\.[^/.]+$/, '');

      let createdAt: Date | undefined;

      if (metadata.exif) {
        try {
          const exif = exifReader(metadata.exif);
          createdAt = exif.Photo?.DateTimeOriginal;
        } catch (error) {
          console.error(`Error parsing EXIF data for ${file.filename}:`, error);
        }
      }

      // Generate srcSet from pre-generated images
      const imageDir = path.join(optimizedDirectory, nameWithoutExt);
      const srcSet = await generateSrcSet(imageDir, nameWithoutExt, metadata.width || 0);

      return {
        filename: file.filename,
        src: `/static/photography-optimized/${encodeURIComponent(nameWithoutExt)}/original.jpg`,
        srcSet,
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
  photosWithData.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));

  // Add index-based IDs after sorting
  const photos = photosWithData.map((photo, index) => ({
    ...photo,
    id: index
  }));

  return photos;
}

async function generateSrcSet(imageDir: string, nameWithoutExt: string, originalWidth: number): Promise<string> {
  const srcSetParts: string[] = [];

  for (const width of WIDTHS) {
    if (width > originalWidth) continue;

    const imagePath = path.join(imageDir, `${width}.jpg`);
    try {
      await fs.access(imagePath);
      srcSetParts.push(`/static/photography-optimized/${encodeURIComponent(nameWithoutExt)}/${width}.jpg ${width}w`);
    } catch {
      // Image doesn't exist, skip
    }
  }

  // Add original as fallback
  srcSetParts.push(`/static/photography-optimized/${encodeURIComponent(nameWithoutExt)}/original.jpg ${originalWidth}w`);

  return srcSetParts.join(', ');
}

async function getBlurDataURL(imagePath: string) {
  const buffer = await sharp(imagePath).resize(10, 10, { fit: 'inside' }).jpeg({ quality: 70 }).toBuffer();
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

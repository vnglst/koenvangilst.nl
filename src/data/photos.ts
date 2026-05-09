/**
 * Photography data - stub for build-time EXIF extraction
 *
 * TODO: Create a build-time Vite plugin or script that:
 * 1. Reads all JPEGs from public/static/photography/
 * 2. Extracts EXIF data using exif-reader (Node.js only - cannot run on Cloudflare Workers)
 * 3. Generates this file with the photo metadata
 *
 * The legacy getPhotos.ts used sharp + exif-reader at runtime, which is incompatible
 * with Cloudflare Workers. The solution is to pre-generate this JSON during the build.
 *
 * Run: node scripts/generate-photos-data.mjs
 * Output: src/data/photos.ts (this file)
 */

export type PhotoType = {
  id: number;
  filename: string;
  src: string;
  srcSet: string;
  srcSetWebp: string;
  alt: string;
  width: number;
  height: number;
  isVertical: boolean;
  createdAt?: string;
  location?: string;
  blurDataURL: string;
};

// Populated at build time by scripts/generate-photos-data.mjs
export const photos: PhotoType[] = [];

export function getPhotos(): PhotoType[] {
  return photos;
}

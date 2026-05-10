import fs from 'node:fs';
import path from 'node:path';

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

const DATA_FILE = path.join(process.cwd(), 'public/static/photos-data.json');

let cachedPhotos: PhotoType[] | null = null;

export async function getPhotos(): Promise<PhotoType[]> {
  if (cachedPhotos) return cachedPhotos;

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    cachedPhotos = JSON.parse(raw) as PhotoType[];
    return cachedPhotos;
  } catch {
    console.warn('[photos] photos-data.json not found — run scripts/generate-photos-data.mjs');
    return [];
  }
}


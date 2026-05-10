import fs from 'node:fs';
import path from 'node:path';

import type { PhotoType } from '#/data/photos';

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


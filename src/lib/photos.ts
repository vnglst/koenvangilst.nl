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

const PHOTOS_DATA_URL = process.env.ZIPLINE_PHOTOS_DATA_URL || 'https://files.koenvangilst.nl/go/photos-data';
const PHOTOS_MANIFEST_PATH = process.env.PHOTOS_MANIFEST_PATH;
const ZIPLINE_URL = 'https://files.koenvangilst.nl';

const CACHE_TTL_MS = 5 * 1000; // 5 seconds

let cachedPhotos: { data: PhotoType[]; fetchedAt: number } | null = null;
let inFlightFetch: Promise<PhotoType[]> | null = null;

function absoluteZiplineUrl(url: string) {
  if (url.startsWith('/z/')) {
    return new URL(url.slice('/z'.length), ZIPLINE_URL).toString();
  }

  return url;
}

function normalizeSrcSet(srcSet: string) {
  return srcSet
    .split(',')
    .map((part) => {
      const [url, descriptor] = part.trim().split(/\s+/, 2);
      return descriptor ? `${absoluteZiplineUrl(url)} ${descriptor}` : absoluteZiplineUrl(url);
    })
    .join(', ');
}

function normalizePhotoUrls(photos: PhotoType[]) {
  return photos.map((photo) => ({
    ...photo,
    src: absoluteZiplineUrl(photo.src),
    srcSet: normalizeSrcSet(photo.srcSet),
    srcSetWebp: normalizeSrcSet(photo.srcSetWebp)
  }));
}

async function fetchPhotosData(): Promise<PhotoType[]> {
  if (PHOTOS_MANIFEST_PATH) {
    try {
      const { readFile } = await import('node:fs/promises');
      return JSON.parse(await readFile(PHOTOS_MANIFEST_PATH, 'utf8')) as PhotoType[];
    } catch (err) {
      console.warn('[photos] Failed to read local photos manifest:', err);
      throw err;
    }
  }

  const res = await fetch(PHOTOS_DATA_URL, {
    headers: { Accept: 'application/json' }
  });

  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status}`);
  }

  return (await res.json()) as PhotoType[];
}

async function refreshPhotos(): Promise<PhotoType[]> {
  try {
    const photos = normalizePhotoUrls(await fetchPhotosData());
    cachedPhotos = { data: photos, fetchedAt: Date.now() };
    return photos;
  } catch (err) {
    console.warn('[photos] Failed to fetch photos-data from Zipline:', err);
    return cachedPhotos ? cachedPhotos.data : [];
  }
}

export async function getPhotos(): Promise<PhotoType[]> {
  const isStale = !cachedPhotos || Date.now() - cachedPhotos.fetchedAt >= CACHE_TTL_MS;

  if (isStale && !inFlightFetch) {
    inFlightFetch = refreshPhotos().finally(() => {
      inFlightFetch = null;
    });
  }

  if (cachedPhotos) {
    return cachedPhotos.data;
  }

  return inFlightFetch as Promise<PhotoType[]>;
}

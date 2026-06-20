#!/usr/bin/env node
/**
 * Zipline Photography Sync
 *
 * Polls a Zipline "originals" folder, generates responsive JPEG/WebP variants,
 * and writes a local mirrored manifest for the website to serve from /photos/*.
 * Zipline remains the source for originals only; optimized files live in the
 * shared photography-data Docker volume.
 */

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import exifReader from 'exif-reader';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ZIPLINE_URL = (process.env.ZIPLINE_URL || '').replace(/\/+$/, '');
const ZIPLINE_TOKEN = process.env.ZIPLINE_TOKEN || '';
const ORIGINALS_FOLDER_ID = process.env.ZIPLINE_ORIGINALS_FOLDER_ID || '';
const PHOTOS_DATA_PATH = process.env.PHOTOS_DATA_PATH || path.join(__dirname, 'photos-data.json');
const PHOTOS_OUTPUT_DIR = process.env.PHOTOS_OUTPUT_DIR || path.join(__dirname, 'data/files');
const PHOTOS_PUBLIC_BASE_URL = (process.env.PHOTOS_PUBLIC_BASE_URL || '/photos').replace(/\/+$/, '');

const WIDTHS = [480, 768, 1080, 1440, 1920, 2560];
const CONCURRENCY = 3;

const JPEG_QUALITY_RESPONSIVE = 85;
const JPEG_QUALITY_ORIGINAL = 90;
const WEBP_QUALITY_RESPONSIVE = 85;
const WEBP_QUALITY_ORIGINAL = 90;
const WEBP_EFFORT = 6;

function validateConfig() {
  const missing = [];
  if (!ZIPLINE_URL) missing.push('ZIPLINE_URL');
  if (!ZIPLINE_TOKEN) missing.push('ZIPLINE_TOKEN');
  if (!ORIGINALS_FOLDER_ID) missing.push('ZIPLINE_ORIGINALS_FOLDER_ID');

  if (missing.length) {
    console.error(`Missing required env vars: ${missing.join(', ')}`);
    console.error('Set ZIPLINE_URL, ZIPLINE_TOKEN, and ZIPLINE_ORIGINALS_FOLDER_ID.');
    process.exit(1);
  }
}

function sanitizeName(name) {
  return name.replace(/,\s*/g, '-').replace(/\s+/g, '-').replace(/-+/g, '-');
}

function getOriginalFilename(file) {
  return file.originalName || file.original_name || file.originalFilename || file.original_filename || file.name;
}

function getOriginalSize(file) {
  return file.size || file.fileSize || file.file_size || file.data?.size || null;
}

function getLocationFromFilename(filename) {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  if (!nameWithoutExt.includes('-')) return undefined;
  return nameWithoutExt.split('-')[0].trim() || undefined;
}

function publicUrl(filename) {
  return `${PHOTOS_PUBLIC_BASE_URL}/${filename}`;
}

function hashBuffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 12);
}

function log(prefix, msg) {
  console.log(`${prefix} ${msg}`);
}

async function ziplineFetch(apiPath, options = {}) {
  const url = apiPath.startsWith('http') ? apiPath : `${ZIPLINE_URL}${apiPath}`;
  const headers = {
    Authorization: ZIPLINE_TOKEN,
    ...options.headers
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Zipline ${options.method || 'GET'} ${apiPath} -> ${res.status}: ${body}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

async function listFolderFiles(folderId) {
  const data = await ziplineFetch(`/api/user/folders/${folderId}`);
  return data.files || [];
}

async function loadPhotosData() {
  try {
    const raw = await fs.readFile(PHOTOS_DATA_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function downloadFile(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function writeFileAtomic(filePath, bufferOrString) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tmpPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  await fs.writeFile(tmpPath, bufferOrString);
  await fs.rename(tmpPath, filePath);
}

async function writeVariant(filename, buffer) {
  const filePath = path.join(PHOTOS_OUTPUT_DIR, filename);

  try {
    await fs.access(filePath);
    return;
  } catch {}

  await writeFileAtomic(filePath, buffer);
}

function filenamesFromPhoto(photo) {
  const urls = [photo.src, photo.srcSet, photo.srcSetWebp]
    .filter(Boolean)
    .flatMap((value) => String(value).split(','))
    .map((part) => part.trim().split(/\s+/, 1)[0])
    .filter((url) => url.startsWith(`${PHOTOS_PUBLIC_BASE_URL}/`));

  return [...new Set(urls.map((url) => decodeURIComponent(url.slice(PHOTOS_PUBLIC_BASE_URL.length + 1))))];
}

async function cleanupRemovedPhoto(photo) {
  const filenames = filenamesFromPhoto(photo);
  if (filenames.length === 0) {
    log('[cleanup]', `no local variants found for ${photo.filename}`);
    return;
  }

  log('[cleanup]', `removing ${filenames.length} variant(s) for ${photo.filename}`);

  for (const filename of filenames) {
    try {
      await fs.unlink(path.join(PHOTOS_OUTPUT_DIR, filename));
    } catch (err) {
      if (err?.code !== 'ENOENT') throw err;
    }
  }
}

async function cleanupRemovedPhotos(removedPhotos) {
  for (const photo of removedPhotos) {
    await cleanupRemovedPhoto(photo);
  }
}

function shouldProcessOriginal(original, existingPhoto) {
  if (!existingPhoto) return true;
  if (!existingPhoto.sourceHash) return true;
  if (existingPhoto.originalId && existingPhoto.originalId !== original.id) return true;

  const originalSize = getOriginalSize(original);
  if (originalSize !== null && existingPhoto.originalSize !== originalSize) return true;

  return filenamesFromPhoto(existingPhoto).length === 0;
}

async function processOriginal(originalFile) {
  const filename = getOriginalFilename(originalFile);
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  const safeName = sanitizeName(nameWithoutExt);
  const location = getLocationFromFilename(filename);

  log('[photo]', `processing ${filename}`);
  if (!location) {
    log('[warn]', `no location found in original filename. Expected format: "Location-IMG_1234.jpg"`);
  }

  const originalUrl = originalFile.url.startsWith('http') ? originalFile.url : `${ZIPLINE_URL}${originalFile.url}`;
  const originalBuffer = await downloadFile(originalUrl);
  const sourceHash = hashBuffer(originalBuffer);

  const image = sharp(originalBuffer);
  const metadata = await image.metadata();
  const originalWidth = metadata.width || 0;
  const originalHeight = metadata.height || 0;
  const aspectRatio = originalWidth / originalHeight;

  let createdAt;
  if (metadata.exif) {
    try {
      const exif = exifReader(metadata.exif);
      const dt = exif.Photo?.DateTimeOriginal;
      if (dt) createdAt = dt instanceof Date ? dt.toISOString() : String(dt);
    } catch {}
  }
  if (!createdAt) {
    createdAt = originalFile.createdAt || new Date().toISOString();
  }

  const srcSetJpegParts = [];
  const srcSetWebpParts = [];

  for (const width of WIDTHS) {
    if (width > originalWidth) continue;

    const jpegVariantName = `${safeName}-${sourceHash}-${width}.jpg`;
    const webpVariantName = `${safeName}-${sourceHash}-${width}.webp`;

    const jpegBuffer = await sharp(originalBuffer)
      .resize(width, null, { withoutEnlargement: true, fit: 'inside' })
      .jpeg({ quality: JPEG_QUALITY_RESPONSIVE, progressive: true, mozjpeg: true })
      .toBuffer();
    await writeVariant(jpegVariantName, jpegBuffer);
    srcSetJpegParts.push(`${publicUrl(jpegVariantName)} ${width}w`);

    const webpBuffer = await sharp(originalBuffer)
      .resize(width, null, { withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: WEBP_QUALITY_RESPONSIVE, effort: WEBP_EFFORT })
      .toBuffer();
    await writeVariant(webpVariantName, webpBuffer);
    srcSetWebpParts.push(`${publicUrl(webpVariantName)} ${width}w`);
  }

  const originalJpegName = `${safeName}-${sourceHash}-original.jpg`;
  const originalWebpName = `${safeName}-${sourceHash}-original.webp`;

  const originalJpegBuffer = await sharp(originalBuffer)
    .jpeg({ quality: JPEG_QUALITY_ORIGINAL, progressive: true, mozjpeg: true })
    .toBuffer();
  await writeVariant(originalJpegName, originalJpegBuffer);

  const originalWebpBuffer = await sharp(originalBuffer)
    .webp({ quality: WEBP_QUALITY_ORIGINAL, effort: WEBP_EFFORT })
    .toBuffer();
  await writeVariant(originalWebpName, originalWebpBuffer);

  srcSetJpegParts.push(`${publicUrl(originalJpegName)} ${originalWidth}w`);
  srcSetWebpParts.push(`${publicUrl(originalWebpName)} ${originalWidth}w`);

  const blurBuffer = await sharp(originalBuffer).resize(10, 10, { fit: 'inside' }).jpeg({ quality: 70 }).toBuffer();

  log('[done]', `${filename}`);

  return {
    id: 0,
    filename,
    originalId: originalFile.id,
    originalSize: getOriginalSize(originalFile),
    sourceHash,
    src: publicUrl(originalJpegName),
    srcSet: srcSetJpegParts.join(', '),
    srcSetWebp: srcSetWebpParts.join(', '),
    alt: location || 'Photo',
    width: originalWidth,
    height: originalHeight,
    isVertical: aspectRatio < 1,
    createdAt,
    location,
    blurDataURL: `data:image/jpeg;base64,${blurBuffer.toString('base64')}`
  };
}

async function processBatch(items, fn, concurrency) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(batch.map(fn));
    const failures = [];
    for (const result of batchResults) {
      if (result.status === 'fulfilled' && result.value) {
        results.push(result.value);
      } else if (result.status === 'rejected') {
        failures.push(result.reason);
        log('[error]', result.reason.message);
      }
    }

    if (failures.length > 0) {
      throw new Error(`Failed to process ${failures.length} photo(s)`);
    }
  }
  return results;
}

async function writePhotosData(photos) {
  await writeFileAtomic(PHOTOS_DATA_PATH, JSON.stringify(photos, null, 2));
  log('[write]', `manifest ${path.relative(process.cwd(), PHOTOS_DATA_PATH)}`);
}

async function main() {
  validateConfig();
  await fs.mkdir(PHOTOS_OUTPUT_DIR, { recursive: true });

  log('[zipline]', ZIPLINE_URL);

  const existingPhotos = await loadPhotosData();
  log('[manifest]', `${existingPhotos.length} existing photos`);

  const originals = await listFolderFiles(ORIGINALS_FOLDER_ID);
  const photoOriginals = originals.filter((file) => {
    const name = getOriginalFilename(file) || '';
    return /\.(jpg|jpeg|png)$/i.test(name);
  });
  log('[originals]', `${photoOriginals.length} photos`);

  const currentOriginalFilenames = new Set(photoOriginals.map(getOriginalFilename));
  const removedPhotos = existingPhotos.filter((photo) => !currentOriginalFilenames.has(photo.filename));
  if (removedPhotos.length > 0) {
    log('[cleanup]', `${removedPhotos.length} removed original photo(s)`);
    await cleanupRemovedPhotos(removedPhotos);
  }

  const existingByFilename = new Map(existingPhotos.map((photo) => [photo.filename, photo]));
  const originalsToProcess = photoOriginals.filter((original) => {
    const filename = getOriginalFilename(original);
    return shouldProcessOriginal(original, existingByFilename.get(filename));
  });

  log('[sync]', `${originalsToProcess.length} photo(s) to process`);

  const processedEntries = await processBatch(originalsToProcess, processOriginal, CONCURRENCY);
  const processedByFilename = new Map(processedEntries.map((photo) => [photo.filename, photo]));

  for (const processedPhoto of processedEntries) {
    const previousPhoto = existingByFilename.get(processedPhoto.filename);
    if (previousPhoto?.sourceHash && previousPhoto.sourceHash !== processedPhoto.sourceHash) {
      await cleanupRemovedPhoto(previousPhoto);
    }
  }

  const photos = photoOriginals
    .map((original) => {
      const filename = getOriginalFilename(original);
      return processedByFilename.get(filename) || existingByFilename.get(filename);
    })
    .filter(Boolean);

  photos.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  photos.forEach((photo, index) => {
    photo.id = index;
  });

  await writePhotosData(photos);
  log('[complete]', `${photos.length} photos total (${processedEntries.length} processed)`);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});

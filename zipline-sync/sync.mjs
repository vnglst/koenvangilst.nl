#!/usr/bin/env node
/**
 * Zipline Photography Sync
 *
 * Polls a Zipline "originals" folder for new photos, generates responsive
 * optimized variants (JPEG + WebP at responsive widths), uploads them to an "optimized"
 * folder, and publishes a photos-data.json manifest (EXIF + URLs) via a stable
 * vanity short URL.
 *
 * Idempotent: re-running only processes new originals. Existing variants are
 * matched by originalName and reused.
 *
 * Usage:
 *   node sync.mjs                    # process all new photos
 *   node sync.mjs --dry-run          # list what would be processed without uploading
 *   node sync.mjs --rebuild          # re-process ALL originals (re-upload all variants)
 *
 * Env vars (read from .env.zipline or process.env):
 *   ZIPLINE_URL                    e.g. https://files.koenvangilst.nl
 *   ZIPLINE_TOKEN                  API token (Dashboard > avatar > Copy token)
 *   ZIPLINE_ORIGINALS_FOLDER_ID    folder where you upload originals manually
 *   ZIPLINE_OPTIMIZED_FOLDER_ID    folder where variants + photos-data.json go
 *   ZIPLINE_VANITY                 (optional) vanity slug for photos-data, default "photos-data"
 *   PHOTOS_DATA_PATH               (optional) local cache path, default ./photos-data.json
 */

import exifReader from 'exif-reader';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const REBUILD = args.has('--rebuild');

const ZIPLINE_URL = (process.env.ZIPLINE_URL || '').replace(/\/+$/, '');
const ZIPLINE_TOKEN = process.env.ZIPLINE_TOKEN || '';
const ORIGINALS_FOLDER_ID = process.env.ZIPLINE_ORIGINALS_FOLDER_ID || '';
const OPTIMIZED_FOLDER_ID = process.env.ZIPLINE_OPTIMIZED_FOLDER_ID || '';
const VANITY = process.env.ZIPLINE_VANITY || 'photos-data';
const PHOTOS_DATA_PATH = process.env.PHOTOS_DATA_PATH || path.join(__dirname, 'photos-data.json');

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
  if (!OPTIMIZED_FOLDER_ID) missing.push('ZIPLINE_OPTIMIZED_FOLDER_ID');
  if (missing.length) {
    console.error(`Missing required env vars: ${missing.join(', ')}`);
    console.error('');
    console.error('Create a .env.zipline file with:');
    console.error('  ZIPLINE_URL=https://files.koenvangilst.nl');
    console.error('  ZIPLINE_TOKEN=<your-api-token>');
    console.error('  ZIPLINE_ORIGINALS_FOLDER_ID=<folder-id>');
    console.error('  ZIPLINE_OPTIMIZED_FOLDER_ID=<folder-id>');
    console.error('');
    console.error('Then run: node --env-file=.env.zipline sync.mjs');
    process.exit(1);
  }
}

function sanitizeName(name) {
  return name.replace(/,\s*/g, '-').replace(/\s+/g, '-').replace(/-+/g, '-');
}

function getOriginalFilename(file) {
  return file.originalName || file.original_name || file.originalFilename || file.original_filename || file.name;
}

function getLocationFromFilename(filename) {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  if (!nameWithoutExt.includes('-')) return undefined;
  return nameWithoutExt.split('-')[0].trim() || undefined;
}

function getVariantNames(filename) {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  const safeName = sanitizeName(nameWithoutExt);
  const responsiveVariants = WIDTHS.flatMap((width) => [`${safeName}-${width}.jpg`, `${safeName}-${width}.webp`]);
  return [...responsiveVariants, `${safeName}-original.jpg`, `${safeName}-original.webp`];
}

function getPhotoFilename(photo) {
  return photo.filename;
}

function absoluteZiplineUrl(ziplineUrl) {
  if (ziplineUrl.startsWith('/z/')) {
    return new URL(ziplineUrl.slice('/z'.length), ZIPLINE_URL).toString();
  }

  try {
    return new URL(ziplineUrl, ZIPLINE_URL).toString();
  } catch {
    return ziplineUrl;
  }
}

function normalizeSrcSet(srcSet) {
  if (!srcSet) return srcSet;
  return srcSet
    .split(',')
    .map((part) => {
      const [url, descriptor] = part.trim().split(/\s+/, 2);
      return descriptor ? `${absoluteZiplineUrl(url)} ${descriptor}` : absoluteZiplineUrl(url);
    })
    .join(', ');
}

function normalizePhotoUrls(photos) {
  return photos.map((photo) => ({
    ...photo,
    src: photo.src ? absoluteZiplineUrl(photo.src) : photo.src,
    srcSet: normalizeSrcSet(photo.srcSet),
    srcSetWebp: normalizeSrcSet(photo.srcSetWebp)
  }));
}

function log(emoji, msg) {
  console.log(`${emoji}  ${msg}`);
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

async function uploadFile(buffer, filename, mimeType, folderId) {
  const formData = new FormData();
  const blob = new Blob([buffer], { type: mimeType });
  formData.append('file', blob, filename);

  const res = await fetch(`${ZIPLINE_URL}/api/upload`, {
    method: 'POST',
    headers: {
      Authorization: ZIPLINE_TOKEN,
      'x-zipline-folder': folderId,
      'x-zipline-original-name': 'true'
    },
    body: formData
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Upload failed (${res.status}): ${body}`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    const url = typeof data === 'string' ? data : data.url || data.files?.[0]?.url;
    if (!url) throw new Error('Upload response missing url');
    return { id: null, name: filename, originalName: filename, type: mimeType, url };
  }
  const url = await res.text();
  return { id: null, name: filename, type: mimeType, url };
}

async function deleteFile(fileId) {
  if (!fileId) return;
  try {
    await ziplineFetch(`/api/user/files/${fileId}`, { method: 'DELETE' });
  } catch (err) {
    log('⚠️', `Failed to delete file ${fileId}: ${err.message}`);
  }
}

async function cleanupRemovedPhoto(photo, optimizedMap) {
  const variantNames = getVariantNames(photo.filename);
  const existingVariants = variantNames.map((name) => optimizedMap.get(name)).filter(Boolean);

  if (existingVariants.length === 0) {
    log('🧹', `No optimized variants found for removed photo: ${photo.filename}`);
    return;
  }

  log('🧹', `Cleaning ${existingVariants.length} optimized variant(s) for removed photo: ${photo.filename}`);

  for (const variant of existingVariants) {
    if (DRY_RUN) {
      log('🔹', `  [dry-run] would delete ${variant.originalName || variant.name || variant.id}`);
      continue;
    }

    await deleteFile(variant.id);
    if (variant.originalName) optimizedMap.delete(variant.originalName);
    log('✓', `  Deleted ${variant.originalName || variant.name || variant.id}`);
  }
}

async function cleanupRemovedPhotos(removedPhotos, optimizedMap) {
  for (const photo of removedPhotos) {
    await cleanupRemovedPhoto(photo, optimizedMap);
  }
}

async function findVanityUrl(vanity) {
  const urls = await ziplineFetch('/api/user/urls');
  const list = Array.isArray(urls) ? urls : urls.data || [];
  return list.find((u) => u.vanity === vanity);
}

async function createVanityUrl(vanity, destination) {
  return ziplineFetch('/api/user/urls', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vanity, destination, enabled: true })
  });
}

async function updateVanityUrl(urlId, destination) {
  return ziplineFetch(`/api/user/urls/${urlId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination })
  });
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

async function getExistingPhotosDataUrl() {
  try {
    const vanity = await findVanityUrl(VANITY);
    if (!vanity) return null;
    if (!vanity.destination) return null;
    const res = await fetch(absoluteZiplineUrl(vanity.destination));
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function processOriginal(originalFile, optimizedMap) {
  const filename = getOriginalFilename(originalFile);
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  const safeName = sanitizeName(nameWithoutExt);
  const location = getLocationFromFilename(filename);

  log('📸', `Processing: ${filename}`);
  if (!location) {
    log('⚠️', `  No location found in original filename. Expected format: "Location-IMG_1234.jpg"`);
  }

  const originalUrl = originalFile.url.startsWith('http') ? originalFile.url : `${ZIPLINE_URL}${originalFile.url}`;
  const originalBuffer = await downloadFile(originalUrl);

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
  let originalJpegUrl = null;
  let originalWebpUrl = null;

  const variantsToUpload = [];

  for (const width of WIDTHS) {
    if (width > originalWidth) continue;

    const jpegVariantName = `${safeName}-${width}.jpg`;
    const webpVariantName = `${safeName}-${width}.webp`;

    if (!optimizedMap.has(jpegVariantName)) {
      const jpegBuffer = await sharp(originalBuffer)
        .resize(width, null, { withoutEnlargement: true, fit: 'inside' })
        .jpeg({ quality: JPEG_QUALITY_RESPONSIVE, progressive: true, mozjpeg: true })
        .toBuffer();
      variantsToUpload.push({
        name: jpegVariantName,
        buffer: jpegBuffer,
        mimeType: 'image/jpeg'
      });
    } else {
      const existing = optimizedMap.get(jpegVariantName);
      srcSetJpegParts.push(`${absoluteZiplineUrl(existing.url)} ${width}w`);
    }

    if (!optimizedMap.has(webpVariantName)) {
      const webpBuffer = await sharp(originalBuffer)
        .resize(width, null, { withoutEnlargement: true, fit: 'inside' })
        .webp({ quality: WEBP_QUALITY_RESPONSIVE, effort: WEBP_EFFORT })
        .toBuffer();
      variantsToUpload.push({
        name: webpVariantName,
        buffer: webpBuffer,
        mimeType: 'image/webp'
      });
    } else {
      const existing = optimizedMap.get(webpVariantName);
      srcSetWebpParts.push(`${absoluteZiplineUrl(existing.url)} ${width}w`);
    }
  }

  const origJpegName = `${safeName}-original.jpg`;
  const origWebpName = `${safeName}-original.webp`;

  if (!optimizedMap.has(origJpegName)) {
    const jpegBuffer = await sharp(originalBuffer)
      .jpeg({ quality: JPEG_QUALITY_ORIGINAL, progressive: true, mozjpeg: true })
      .toBuffer();
    variantsToUpload.push({
      name: origJpegName,
      buffer: jpegBuffer,
      mimeType: 'image/jpeg'
    });
  } else {
    originalJpegUrl = optimizedMap.get(origJpegName).url;
  }

  if (!optimizedMap.has(origWebpName)) {
    const webpBuffer = await sharp(originalBuffer)
      .webp({ quality: WEBP_QUALITY_ORIGINAL, effort: WEBP_EFFORT })
      .toBuffer();
    variantsToUpload.push({
      name: origWebpName,
      buffer: webpBuffer,
      mimeType: 'image/webp'
    });
  } else {
    originalWebpUrl = optimizedMap.get(origWebpName).url;
  }

  log('⬆️', `  Uploading ${variantsToUpload.length} new variants...`);

  for (const variant of variantsToUpload) {
    if (DRY_RUN) {
      log('🔹', `  [dry-run] would upload ${variant.name} (${variant.buffer.length} bytes)`);
      const dummyUrl = `${ZIPLINE_URL}/u/dry-run/${variant.name}`;
      optimizedMap.set(variant.name, { id: null, url: dummyUrl, originalName: variant.name });
    } else {
      const uploaded = await uploadFile(variant.buffer, variant.name, variant.mimeType, OPTIMIZED_FOLDER_ID);
      optimizedMap.set(variant.name, uploaded);
      log('✓', `  ${variant.name} -> ${uploaded.url}`);
    }

    const uploaded = optimizedMap.get(variant.name);

    if (variant.name.endsWith('-original.jpg')) {
      originalJpegUrl = uploaded.url;
    } else if (variant.name.endsWith('-original.webp')) {
      originalWebpUrl = uploaded.url;
    } else if (variant.name.match(/-\d+\.jpg$/)) {
      const width = parseInt(variant.name.match(/-(\d+)\.jpg$/)[1], 10);
      srcSetJpegParts.push(`${absoluteZiplineUrl(uploaded.url)} ${width}w`);
    } else if (variant.name.match(/-\d+\.webp$/)) {
      const width = parseInt(variant.name.match(/-(\d+)\.webp$/)[1], 10);
      srcSetWebpParts.push(`${absoluteZiplineUrl(uploaded.url)} ${width}w`);
    }
  }

  if (originalJpegUrl) {
    srcSetJpegParts.push(`${absoluteZiplineUrl(originalJpegUrl)} ${originalWidth}w`);
  }
  if (originalWebpUrl) {
    srcSetWebpParts.push(`${absoluteZiplineUrl(originalWebpUrl)} ${originalWidth}w`);
  }

  const blurBuffer = await sharp(originalBuffer).resize(10, 10, { fit: 'inside' }).jpeg({ quality: 70 }).toBuffer();

  const entry = {
    id: 0,
    filename,
    src: originalJpegUrl ? absoluteZiplineUrl(originalJpegUrl) : '',
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

  log('✅', `  Done: ${filename} (${variantsToUpload.length} uploaded)`);
  return entry;
}

async function publishPhotosData(photos) {
  const jsonData = JSON.stringify(photos, null, 2);
  const jsonBuffer = Buffer.from(jsonData, 'utf8');

  log('📦', 'Publishing photos-data.json to Zipline...');

  if (DRY_RUN) {
    log('🔹', `[dry-run] would upload photos-data.json (${jsonBuffer.length} bytes)`);
    return;
  }

  const existingDataFile = Array.from(optimizedMapCache.values()).find((f) => f.originalName === 'photos-data.json');
  const uploaded = await uploadFile(jsonBuffer, 'photos-data.json', 'application/json', OPTIMIZED_FOLDER_ID);
  log('⬆️', `  Uploaded photos-data.json -> ${uploaded.url}`);

  const destination = uploaded.url.startsWith('http') ? uploaded.url : `${ZIPLINE_URL}${uploaded.url}`;

  const existingVanity = await findVanityUrl(VANITY);
  if (existingVanity) {
    await updateVanityUrl(existingVanity.id, destination);
    log('🔗', `  Updated vanity "${VANITY}" -> ${destination}`);
  } else {
    await createVanityUrl(VANITY, destination);
    log('🔗', `  Created vanity "${VANITY}" -> ${destination}`);
  }

  if (existingDataFile?.id) {
    await deleteFile(existingDataFile.id);
    log('🗑️', `  Deleted old photos-data.json (${existingDataFile.id})`);
  }

  log('🌐', `  Frontend can fetch: ${destination}`);
}

let optimizedMapCache = new Map();

async function buildOptimizedMap() {
  const files = await listFolderFiles(OPTIMIZED_FOLDER_ID);
  const map = new Map();
  for (const file of files) {
    const key = file.originalName || file.name;
    if (key) {
      map.set(key, { id: file.id, url: file.url, originalName: key });
    }
  }
  optimizedMapCache = map;
  return map;
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
        log('❌', `Error: ${result.reason.message}`);
      }
    }

    if (failures.length > 0) {
      throw new Error(`Failed to process ${failures.length} photo(s)`);
    }
  }
  return results;
}

async function main() {
  validateConfig();

  if (DRY_RUN) log('🔹', 'DRY RUN - no uploads will happen');
  if (REBUILD) log('🔄', 'REBUILD mode - re-processing all originals');

  log('🔌', `Zipline: ${ZIPLINE_URL}`);

  let photos = await loadPhotosData();
  let photosBeforeNormalize = JSON.stringify(photos);
  photos = normalizePhotoUrls(photos);
  let photosChanged = JSON.stringify(photos) !== photosBeforeNormalize;
  log('📋', `Local cache: ${photos.length} photos`);

  if (photos.length === 0 && !REBUILD) {
    const remote = await getExistingPhotosDataUrl();
    if (remote && Array.isArray(remote) && remote.length > 0) {
      photos = remote;
      photosBeforeNormalize = JSON.stringify(photos);
      photos = normalizePhotoUrls(photos);
      photosChanged = JSON.stringify(photos) !== photosBeforeNormalize;
      log('📥', `Downloaded ${photos.length} photos from Zipline vanity URL`);
    }
  }

  const originals = await listFolderFiles(ORIGINALS_FOLDER_ID);
  const photoOriginals = originals.filter((f) => {
    const name = getOriginalFilename(f) || '';
    return /\.(jpg|jpeg|png)$/i.test(name);
  });
  log('📁', `Originals folder: ${photoOriginals.length} photos`);

  const optimizedMap = await buildOptimizedMap();
  log('📦', `Optimized folder: ${optimizedMap.size} existing variants`);

  const currentOriginalFilenames = new Set(photoOriginals.map(getOriginalFilename));
  const removedPhotos = REBUILD ? [] : photos.filter((photo) => !currentOriginalFilenames.has(getPhotoFilename(photo)));
  if (removedPhotos.length > 0) {
    log('🗑️', `Found ${removedPhotos.length} removed original photo(s)`);
    await cleanupRemovedPhotos(removedPhotos, optimizedMap);
    photos = photos.filter((photo) => currentOriginalFilenames.has(getPhotoFilename(photo)));
    photosChanged = true;
  }

  const existingFilenames = new Set(photos.map((p) => p.filename));
  let newOriginals;

  if (REBUILD) {
    newOriginals = photoOriginals;
    photos = [];
  } else {
    newOriginals = photoOriginals.filter((f) => {
      const name = getOriginalFilename(f);
      return !existingFilenames.has(name);
    });
  }

  if (newOriginals.length === 0) {
    log('✅', 'No new photos to process');
    if (DRY_RUN && photosChanged) {
      log('🔹', '[dry-run] skipping cache write and photos-data publish');
    } else if (!DRY_RUN && photos.length > 0) {
      await fs.writeFile(PHOTOS_DATA_PATH, JSON.stringify(photos, null, 2));
      if (photosChanged) {
        await publishPhotosData(photos);
      }
    } else if (!DRY_RUN && photosChanged) {
      await fs.writeFile(PHOTOS_DATA_PATH, JSON.stringify(photos, null, 2));
      await publishPhotosData(photos);
    }
    return;
  }

  log('🆕', `Processing ${newOriginals.length} new photo(s)`);

  const newEntries = await processBatch(
    newOriginals,
    (original) => processOriginal(original, optimizedMap),
    CONCURRENCY
  );

  photos = [...photos, ...newEntries];

  photos.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  photos.forEach((p, i) => {
    p.id = i;
  });

  if (DRY_RUN) {
    log('🔹', '[dry-run] skipping cache write');
  } else {
    await fs.writeFile(PHOTOS_DATA_PATH, JSON.stringify(photos, null, 2));
    log('💾', `Wrote local cache: ${path.relative(process.cwd(), PHOTOS_DATA_PATH)}`);
    await publishPhotosData(photos);
  }

  log('✅', `Sync complete: ${photos.length} photos total (${newEntries.length} new)`);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});

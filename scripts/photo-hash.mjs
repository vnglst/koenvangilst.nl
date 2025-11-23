import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, '../public/static/photography');
const HASH_FILE = path.join(__dirname, '../.photo-manifest.json');

/**
 * Generate a hash of all photos in the directory
 * This is used to detect if photos have changed
 */
export async function generatePhotoHash() {
  const files = (await fs.readdir(INPUT_DIR))
    .filter((filename) => /\.(jpg|jpeg)$/i.test(filename))
    .sort(); // Sort for consistent hashing

  const hashData = await Promise.all(
    files.map(async (filename) => {
      const filePath = path.join(INPUT_DIR, filename);
      const stats = await fs.stat(filePath);
      // Use filename, size, and mtime for hash
      // This is faster than hashing entire file contents
      return `${filename}:${stats.size}:${stats.mtimeMs}`;
    })
  );

  const hash = crypto
    .createHash('sha256')
    .update(hashData.join('|'))
    .digest('hex');

  return {
    hash,
    files: files.length,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Load the existing photo hash manifest
 */
export async function loadPhotoHash() {
  try {
    const content = await fs.readFile(HASH_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Save the photo hash manifest
 */
export async function savePhotoHash(manifest) {
  await fs.writeFile(HASH_FILE, JSON.stringify(manifest, null, 2));
}

/**
 * Check if photos have changed since last generation
 */
export async function hasPhotosChanged() {
  const currentManifest = await generatePhotoHash();
  const savedManifest = await loadPhotoHash();

  if (!savedManifest) {
    console.log('📸 No previous manifest found - photos need processing');
    return true;
  }

  if (currentManifest.hash !== savedManifest.hash) {
    console.log('📸 Photos have changed - regeneration needed');
    console.log(`   Previous: ${savedManifest.files} files (${savedManifest.hash.slice(0, 8)}...)`);
    console.log(`   Current:  ${currentManifest.files} files (${currentManifest.hash.slice(0, 8)}...)`);
    return true;
  }

  console.log(`📸 Photos unchanged (${currentManifest.files} files, hash: ${currentManifest.hash.slice(0, 8)}...)`);
  return false;
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];

  if (command === 'check') {
    const changed = await hasPhotosChanged();
    process.exit(changed ? 1 : 0);
  } else if (command === 'save') {
    const manifest = await generatePhotoHash();
    await savePhotoHash(manifest);
    console.log('✅ Photo manifest saved:', manifest);
  } else {
    console.log('Usage:');
    console.log('  node photo-hash.mjs check  - Check if photos changed (exit 1 if changed)');
    console.log('  node photo-hash.mjs save   - Save current photo hash');
  }
}

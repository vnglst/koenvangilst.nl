#!/usr/bin/env node
/**
 * Pre-optimize photography images at build time to avoid on-demand image optimization overhead.
 * Generates responsive image variants (thumbnail, medium, large) for faster loading.
 */

import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(__dirname, '../public/static/photography');
const outputDir = path.join(__dirname, '../public/static/photography-optimized');

// Responsive breakpoints
const SIZES = {
  thumb: 400, // Grid thumbnails
  medium: 1200, // Medium screens
  large: 2400 // Full-screen desktop
};

const QUALITY = 85;

async function optimizePhotos() {
  console.log('🖼️  Optimizing photography images...');

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Read all photo files
  const files = await fs.readdir(sourceDir);
  const photoFiles = files.filter((f) => /\.(jpg|jpeg)$/i.test(f));

  console.log(`Found ${photoFiles.length} photos to optimize`);

  let processed = 0;
  for (const filename of photoFiles) {
    const inputPath = path.join(sourceDir, filename);
    const baseName = path.parse(filename).name;

    // Generate variants for each size
    await Promise.all(
      Object.entries(SIZES).map(async ([sizeName, width]) => {
        const outputPath = path.join(outputDir, `${baseName}-${sizeName}.jpg`);

        await sharp(inputPath)
          .resize(width, null, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({
            quality: QUALITY,
            mozjpeg: true
          })
          .toFile(outputPath);
      })
    );

    processed++;
    if (processed % 10 === 0) {
      console.log(`  Processed ${processed}/${photoFiles.length}`);
    }
  }

  console.log(`✅ Optimized ${photoFiles.length} photos`);
}

optimizePhotos().catch((err) => {
  console.error('Error optimizing photos:', err);
  process.exit(1);
});

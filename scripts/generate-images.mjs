import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIDTHS = [384, 640, 750, 828, 1080, 1200, 1920, 2048, 2400];
const INPUT_DIR = path.join(__dirname, '../public/static/photography');
const OUTPUT_DIR = path.join(__dirname, '../public/static/photography-optimized');

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function generateResponsiveImages() {
  console.log('🖼️  Starting image generation (existence-based)...');

  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Read all JPEG files from input directory
  let files = await fs.readdir(INPUT_DIR);
  files = files.filter((filename) => /\.(jpg|jpeg)$/i.test(filename));

  console.log(`Found ${files.length} source images`);

  let processedCount = 0;
  let alreadyExistsCount = 0;

  for (const filename of files) {
    const inputPath = path.join(INPUT_DIR, filename);
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    const imageOutputDir = path.join(OUTPUT_DIR, nameWithoutExt);

    // Get original image metadata
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const originalWidth = metadata.width || 0;

    // Create output directory for this image
    await fs.mkdir(imageOutputDir, { recursive: true });

    let allExist = true;

    // Check if all responsive images exist
    for (const width of WIDTHS) {
      if (width > originalWidth) continue;
      const jpegOutputPath = path.join(imageOutputDir, `${width}.jpg`);
      const webpOutputPath = path.join(imageOutputDir, `${width}.webp`);
      const jpegExists = await fileExists(jpegOutputPath);
      const webpExists = await fileExists(webpOutputPath);
      if (!jpegExists || !webpExists) {
        allExist = false;
        break;
      }
    }
    // Check if original outputs exist
    const originalOutputPath = path.join(imageOutputDir, 'original.jpg');
    const originalWebpPath = path.join(imageOutputDir, 'original.webp');
    const origJpegExists = await fileExists(originalOutputPath);
    const origWebpExists = await fileExists(originalWebpPath);
    if (!origJpegExists || !origWebpExists) {
      allExist = false;
    }

    if (allExist) {
      console.log(`Skipping ${filename} (all sizes + originals exist)`);
      alreadyExistsCount++;
      continue;
    }

    console.log(`Processing: ${filename}`);
    processedCount++;

    // Generate images for each width
    for (const width of WIDTHS) {
      if (width > originalWidth) {
        console.log(`  Skipping ${width}w (larger than original ${originalWidth}px)`);
        continue;
      }
      const jpegOutputPath = path.join(imageOutputDir, `${width}.jpg`);
      const webpOutputPath = path.join(imageOutputDir, `${width}.webp`);
      const jpegExists = await fileExists(jpegOutputPath);
      const webpExists = await fileExists(webpOutputPath);
      if (!jpegExists) {
        await sharp(inputPath)
          .resize(width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({
            quality: 85,
            progressive: true,
            mozjpeg: true
          })
          .toFile(jpegOutputPath);
        console.log(`  Generated: ${width}w (JPEG)`);
      } else {
        console.log(`  Skipped: ${width}w (JPEG exists)`);
      }
      if (!webpExists) {
        await sharp(inputPath)
          .resize(width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp({
            quality: 85,
            effort: 6
          })
          .toFile(webpOutputPath);
        console.log(`  Generated: ${width}w (WebP)`);
      } else {
        console.log(`  Skipped: ${width}w (WebP exists)`);
      }
    }

    // Also copy the original with optimized settings
    if (!origJpegExists) {
      await sharp(inputPath)
        .jpeg({
          quality: 90,
          progressive: true,
          mozjpeg: true
        })
        .toFile(originalOutputPath);
      console.log(`  Generated: original (JPEG)`);
    } else {
      console.log(`  Skipped: original (JPEG exists)`);
    }
    if (!origWebpExists) {
      await sharp(inputPath)
        .webp({
          quality: 90,
          effort: 6
        })
        .toFile(originalWebpPath);
      console.log(`  Generated: original (WebP)`);
    } else {
      console.log(`  Skipped: original (WebP exists)`);
    }
  }

  console.log(`✅ Image generation complete (Generated: ${processedCount}, Already existed: ${alreadyExistsCount})`);
}

generateResponsiveImages().catch((error) => {
  console.error('Error generating images:', error);
  process.exit(1);
});

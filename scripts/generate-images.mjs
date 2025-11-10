import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Common responsive image widths
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

async function isImageOutdated(inputPath, outputPath) {
  if (!(await fileExists(outputPath))) {
    return true;
  }

  const [inputStat, outputStat] = await Promise.all([
    fs.stat(inputPath),
    fs.stat(outputPath)
  ]);

  // If input is newer than output, regenerate
  return inputStat.mtime > outputStat.mtime;
}

async function generateResponsiveImages() {
  console.log('🖼️  Starting image generation...');

  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Read all JPEG files from input directory
  let files = await fs.readdir(INPUT_DIR);
  files = files.filter((filename) => /\.(jpg|jpeg)$/i.test(filename));

  console.log(`Found ${files.length} images to process`);

  let processedCount = 0;
  let skippedCount = 0;

  for (const filename of files) {
    const inputPath = path.join(INPUT_DIR, filename);
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    const imageOutputDir = path.join(OUTPUT_DIR, nameWithoutExt);

    // Check if all images already exist and are up-to-date
    const originalOutputPath = path.join(imageOutputDir, 'original.jpg');
    const needsRegeneration = await isImageOutdated(inputPath, originalOutputPath);

    if (!needsRegeneration) {
      console.log(`Skipping ${filename} (already up-to-date)`);
      skippedCount++;
      continue;
    }

    console.log(`Processing: ${filename}`);
    processedCount++;

    // Get original image metadata
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const originalWidth = metadata.width || 0;

    // Create output directory for this image
    await fs.mkdir(imageOutputDir, { recursive: true });

    // Generate images for each width
    for (const width of WIDTHS) {
      // Skip if width is larger than original
      if (width > originalWidth) {
        console.log(`  Skipping ${width}w (larger than original ${originalWidth}px)`);
        continue;
      }

      const outputPath = path.join(imageOutputDir, `${width}.jpg`);

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
        .toFile(outputPath);

      console.log(`  Generated: ${width}w`);
    }

    // Also copy the original with optimized settings
    await sharp(inputPath)
      .jpeg({
        quality: 90,
        progressive: true,
        mozjpeg: true
      })
      .toFile(originalOutputPath);

    console.log(`  Generated: original (optimized)`);
  }

  console.log(`✅ Image generation complete! (Processed: ${processedCount}, Skipped: ${skippedCount})`);
}

generateResponsiveImages().catch((error) => {
  console.error('Error generating images:', error);
  process.exit(1);
});

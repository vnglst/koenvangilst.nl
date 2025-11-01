import fs from 'fs';

import { headers } from './config/next-headers.js';
import { redirects } from './config/next-redirects.js';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const commitHash = process.env.SOURCE_COMMIT;

/**
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: false,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  headers,
  redirects,
  output: 'standalone',
  env: {
    APP_VERSION: pkg.version,
    COMMIT_HASH: commitHash
  },
  images: {
    minimumCacheTTL: 31536000, // 1 year
    formats: ['image/avif', 'image/webp'], // AVIF first (better compression), WebP fallback
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  }
};

export default config;

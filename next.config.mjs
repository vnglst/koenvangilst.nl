import fs from 'fs';

import { headers } from './config/next-headers.mjs';
import { redirects } from './config/next-redirects.mjs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const commitHash = process.env.SOURCE_COMMIT;

/**
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: false,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  swcMinify: true,
  headers,
  redirects,
  env: {
    APP_VERSION: pkg.version,
    COMMIT_HASH: commitHash
  }
};

export default config;

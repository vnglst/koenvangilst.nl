import childProcess from 'child_process';
import fs from 'fs';

import { headers } from './config/next-headers.mjs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

/**
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: false,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  swcMinify: true,
  headers,
  env: {
    APP_VERSION: pkg.version
  }
};

export default config;

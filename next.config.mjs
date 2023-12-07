import childProcess from 'child_process';
import fs from 'fs';

import { headers } from './config/next-headers.mjs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const commitHash = childProcess
  .execSync('git log --pretty=format:"%h" -n1')
  .toString()
  .trim();

/**
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  swcMinify: true,
  headers,
  env: {
    APP_VERSION: pkg.version,
    COMMIT_HASH: commitHash
  }
};

export default config;

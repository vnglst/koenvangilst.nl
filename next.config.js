const { headers } = require('./config/next-headers');
const pkg = require('./package.json');

const commitHash = require('child_process')
  .execSync('git log --pretty=format:"%h" -n1')
  .toString()
  .trim();

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    swcMinify: true
  },
  headers,
  env: {
    APP_VERSION: pkg.version,
    COMMIT_HASH: commitHash
  }
};

const { withContentlayer } = require('next-contentlayer');

const pkg = require('./package.json');

const commitHash = require('child_process')
  .execSync('git log --pretty=format:"%h" -n1')
  .toString()
  .trim();

/**
 * @type {import('next').NextConfig}
 */
module.exports = withContentlayer()({
  swcMinify: true,
  reactStrictMode: true,
  env: {
    APP_VERSION: pkg.version,
    COMMIT_HASH: commitHash
  }
});

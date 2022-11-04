const { withContentlayer } = require('next-contentlayer');

const pkg = require('./package.json');

const commitHash = require('child_process')
  .execSync('git log --pretty=format:"%h" -n1')
  .toString()
  .trim();

/**
 * @type {import('next').NextConfig}
 */
module.exports = withContentlayer({
  reactStrictMode: true,
  experimental: {
    legacyBrowsers: false,
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'] } }
    ]
  },

  env: {
    APP_VERSION: pkg.version,
    COMMIT_HASH: commitHash
  }
});

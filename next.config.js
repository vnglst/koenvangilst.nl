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
  },
  webpack: (config, { dev, isServer }) => {
    // Replace React with Preact only in client production build

    // TODO: Figure out why @visx/tooltip is not working with Preact
    // Disabling preat until then

    // if (!dev && !isServer) {
    //   Object.assign(config.resolve.alias, {
    //     'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
    //     react: 'preact/compat',
    //     'react-dom/test-utils': 'preact/test-utils',
    //     'react-dom': 'preact/compat'
    //   });
    // }

    return config;
  }
});

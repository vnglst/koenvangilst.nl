module.exports = {
  exportPathMap: function () {
    return {
      '/': { page: '/' },
      '/blog': { page: '/blog' },
      '/profile': { page: '/profile' }
    }
  },
  webpack: function (config, { dev }) {
    // For the development version, we'll use React.
    // Because, it supports react hot loading and so on.
    if (dev) {
      return config
    }

    config.resolve.alias = {
      'react': 'preact-compat/dist/preact-compat',
      'react-dom': 'preact-compat/dist/preact-compat'
    }

    return config
  }
}

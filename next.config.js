const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  exportPathMap: function() {
    return {
      '/': { page: '/' },
      '/blog': { page: '/blog' },
      '/profile': { page: '/profile' },
      '/dedicon': { page: '/dedicon' },
      '/hilfiger': { page: '/hilfiger' },
      '/blog/node-pdf': { page: '/blog/node-pdf' }
    }
  },
  webpack: function(config, { dev }) {
    // For the development version, we'll use React.
    // Because, it supports react hot loading and so on.
    if (dev) {
      return config
    }

    return config
  }
})

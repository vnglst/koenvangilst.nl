const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  exportPathMap: function() {
    return {
      '/': { page: '/' },
      '/profile': { page: '/profile' },
      '/dedicon': { page: '/dedicon' },
      '/hilfiger': { page: '/hilfiger' }
    }
  }
})

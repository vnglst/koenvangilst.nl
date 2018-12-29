const withCSS = require('@zeit/next-css')
const withMDX = require('@zeit/next-mdx')()

module.exports = withMDX(
  withCSS({
    exportPathMap: function() {
      return {
        '/': { page: '/' },
        '/profile': { page: '/profile' },
        '/dedicon': { page: '/dedicon' },
        '/hilfiger': { page: '/hilfiger' }
      }
    }
  })
)

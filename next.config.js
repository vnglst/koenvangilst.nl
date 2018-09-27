const withCSS = require('@zeit/next-css')
const withMDX = require('@zeit/next-mdx')()

module.exports = withMDX(
  withCSS({
    exportPathMap: function() {
      return {
        '/': { page: '/' },
        '/blog': { page: '/blog' },
        '/profile': { page: '/profile' },
        '/dedicon': { page: '/dedicon' },
        '/hilfiger': { page: '/hilfiger' },
        '/blog/node-pdf': { page: '/blog/node-pdf' },
        '/blog/css-in-depth': { page: '/blog/css-in-depth' }
      }
    }
  })
)

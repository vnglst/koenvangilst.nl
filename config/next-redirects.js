export const redirects = async () => {
  return [
    {
      source: '/blog/feed',
      destination: '/feed.xml',
      permanent: true
    },
    // Redirects for /blog to /lab
    {
      source: '/blog',
      destination: '/lab',
      permanent: true
    },
    {
      source: '/blog/:slug*',
      destination: '/lab/:slug*',
      permanent: true
    },
    // Redirects for /labs to /lab
    {
      source: '/labs',
      destination: '/lab',
      permanent: true
    },
    {
      source: '/labs/:slug*',
      destination: '/lab/:slug*',
      permanent: true
    },
    // Redirects for /projects to /lab
    {
      source: '/projects',
      destination: '/lab',
      permanent: true
    },
    {
      source: '/projects/:slug*',
      destination: '/lab/:slug*',
      permanent: true
    },
    // Redirects for /clients to /lab
    {
      source: '/clients',
      destination: '/lab',
      permanent: true
    },
    {
      source: '/clients/:slug*',
      destination: '/lab/:slug*',
      permanent: true
    },
    // Redirects for /portfolio to /lab
    {
      source: '/portfolio',
      destination: '/lab',
      permanent: true
    },
    {
      source: '/portfolio/:slug*',
      destination: '/lab/:slug*',
      permanent: true
    },
    // Redirects for /snippets to /lab
    {
      source: '/snippets',
      destination: '/lab',
      permanent: true
    },
    {
      source: '/snippets/:slug*',
      destination: '/lab/:slug*',
      permanent: true
    },
    // Redirects for old photo routes to photography page
    {
      source: '/photography/photo/:photoId*',
      destination: '/photography',
      permanent: false
    }
  ];
};

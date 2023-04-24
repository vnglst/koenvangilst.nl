const contentSecurityPolicy = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' *.youtube.com *.twitter.com;
    script-src-elem 'self' 'unsafe-inline';
    child-src *.youtube.com *.twitter.com;
    style-src 'self' 'unsafe-inline';
    img-src * blob: data:;
    media-src i.imgur.com;
    connect-src *;
    font-src 'self';
    frame-src svelte.dev codesandbox.io;
`;

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: contentSecurityPolicy.replace(/\n/g, '')
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  }
];

async function headers() {
  return [
    {
      source: '/(.*)',
      headers: securityHeaders
    }
  ];
}

module.exports = { headers };

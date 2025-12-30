const contentSecurityPolicy = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' *.youtube.com;
    script-src-elem 'self' blob: 'unsafe-inline';
    child-src 'self' blob: *.youtube.com;
    style-src 'self' 'unsafe-inline';
    img-src * blob: data:;
    media-src i.imgur.com github.com *.s3.amazonaws.com;
    connect-src *;
    font-src 'self';
    frame-src 'self' svelte.dev codesandbox.io tetris-time.koenvangilst.nl voronoi-virus.koenvangilst.nl dancing-mosquitoes.koenvangilst.nl pong-wars.koenvangilst.nl purple-rain.koenvangilst.nl particle-life.koenvangilst.nl time-flies.koenvangilst.nl aarde.koenvangilst.nl rock-paper-scissors.koenvangilst.nl;
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
    value: 'camera=(), microphone=()'
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

export async function headers() {
  return [
    {
      source: '/(.*)',
      headers: securityHeaders
    }
  ];
}

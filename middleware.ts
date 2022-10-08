import { userAgent, NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import invariant from 'tiny-invariant';

// regex to check if string contains a file extension
const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  // Runs after the response has been returned
  // so tracking analytics doesn't block rendering
  ev.waitUntil(
    (async () => {
      try {
        await logPageView(req);
      } catch (error) {
        console.error('Error logging analytics', error);
      }
    })()
  );

  return addSecurityHeaders(NextResponse.next());
}

async function logPageView(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    // don't track files like /robots.txt
    PUBLIC_FILE.test(pathname) ||
    // don't track the following paths
    pathname.startsWith('/static') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/logos') ||
    // headers added when next/link pre-fetches a route
    // don't track these
    req.headers.get('x-middleware-preflight')
  ) {
    return;
  }

  const body = JSON.stringify({
    origin: req.nextUrl.origin,
    pathname,
    ua: userAgent(req).ua
    // TODO: add geo tracking later
    // ...req.geo
  });

  if (process.env.NODE_ENV === 'development') {
    return console.log('[Tracking pageview]:', pathname);
  }

  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/visits`, {
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    },
    body,
    method: 'POST'
  });

  console.log('[Tracking pageview]:', pathname);

  invariant(response.status === 201, 'Error logging analytics');
}

function addSecurityHeaders(response: NextResponse) {
  const ContentSecurityPolicy = `
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

  response.headers.set(
    'Content-Security-Policy',
    ContentSecurityPolicy.replace(/\n/g, '')
  );
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  return response;
}

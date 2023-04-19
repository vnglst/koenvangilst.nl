import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse, userAgent } from 'next/server';

import { trackView } from 'api/supabase';

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

  return addHeaders(NextResponse.next());
}

async function logPageView(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // don't track the following paths
  const blackList = ['/static', '/api', '/fonts', '/logos', '/_next'];

  if (
    // don't track files like /robots.txt
    PUBLIC_FILE.test(pathname) ||
    // don't track the following paths
    blackList.some((path) => pathname.startsWith(path)) ||
    // when it's a prefetch request, don't track these
    req.headers.get('purpose') === 'prefetch'
  ) {
    return;
  }

  await trackView({
    origin: req.nextUrl.origin,
    pathname,
    ua: userAgent(req).ua
  });
}

function addHeaders(response: NextResponse) {
  // TODO: Why is this not working with React Server Components
  // const ContentSecurityPolicy = `
  // default-src 'self';
  // script-src 'self' 'unsafe-eval' 'unsafe-inline' *.youtube.com *.twitter.com;
  // script-src-elem 'self' 'unsafe-inline';
  // child-src *.youtube.com *.twitter.com;
  // style-src 'self' 'unsafe-inline';
  // img-src * blob: data:;
  // media-src i.imgur.com;
  // connect-src *;
  // font-src 'self';
  // frame-src svelte.dev codesandbox.io;
  // `;

  // response.headers.set(
  //   'Content-Security-Policy',
  //   ContentSecurityPolicy.replace(/\n/g, '')
  // );
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

  // Dark mode detection headers
  response.headers.set('Accept-CH', 'Sec-CH-Prefers-Color-Scheme');
  response.headers.set('Vary', 'Sec-CH-Prefers-Color-Scheme');
  response.headers.set('Critical-CH', 'Sec-CH-Prefers-Color-Scheme');

  return response;
}

import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse, userAgent } from 'next/server';

import { trackView } from 'api/supabase';

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

  return NextResponse.next();
}

// regex to check if string contains a file extension
const PUBLIC_FILE = /\.(.*)$/;

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

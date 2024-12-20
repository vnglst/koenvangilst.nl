import { supabase } from 'services/supabase.client';

export async function POST(request: Request) {
  const body = await request.json();

  await trackView({
    origin: body.origin,
    pathname: body.pathname,
    ua: request.headers.get('user-agent')
  });

  return new Response(null, { status: 204 });
}

/**
 * Tracks a page view for a given pathname, also storing the user agent.
 */
export async function trackView({ origin, pathname, ua }) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Tracking pageview]:', pathname);
    return;
  }

  const { error } = await supabase.from('visits').insert([{ origin, pathname, ua }]);

  if (error) {
    console.error('Tracking view failed', error);
  }
}

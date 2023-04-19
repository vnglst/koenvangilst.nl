import invariant from 'tiny-invariant';

export async function getViews(pathnameRaw: string): Promise<number> {
  try {
    const pathname = encodeURIComponent(pathnameRaw);
    const request = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/totals?pathname=eq.${pathname}`,
      {
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        method: 'GET',
        next: {
          revalidate: 60
        }
      }
    );

    invariant(request.status === 200, 'Error retrieving view');
    invariant(request.ok, 'Error retrieving view');

    const json = await request.json();
    const views = json.length > 0 ? json[0].total : 0;

    return views;
  } catch (error) {
    console.error('Fetching views failed', error);
    return 0;
  }
}

export async function getViewsPerMonth(pathnameRaw: string): Promise<number> {
  try {
    const pathname = encodeURIComponent(pathnameRaw);
    const request = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/month?pathname=eq.${pathname}`,
      {
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        method: 'GET',
        next: {
          revalidate: 60 * 60 * 24 // 24 hours
        }
      }
    );

    invariant(request.status === 200, 'Error retrieving view');
    invariant(request.ok, 'Error retrieving view');

    const json = await request.json();
    const views = json.length > 0 ? json[0].count : 0;

    return views;
  } catch (error) {
    console.error('Fetching monthly views failed', error);
    return 0;
  }
}

export async function trackView({ origin, pathname, ua }) {
  if (process.env.NODE_ENV === 'development') {
    return console.log('[Tracking pageview]:', pathname);
  }

  try {
    const body = JSON.stringify({ origin, pathname, ua });

    const request = await fetch(`${process.env.SUPABASE_URL}/rest/v1/visits`, {
      headers: {
        apikey: process.env.SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body,
      method: 'POST'
    });

    invariant(request.status === 201, 'Error logging analytics');
    invariant(request.ok, 'Error logging analytics');
  } catch (error) {
    console.error('Tracking view failed', error);
  }
}

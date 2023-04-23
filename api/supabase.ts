import invariant from 'tiny-invariant';

const HEADERS = {
  apikey: process.env.SUPABASE_ANON_KEY,
  'Content-Type': 'application/json'
};

const URLS = {
  totals: `${process.env.SUPABASE_URL}/rest/v1/totals`,
  perMonth: `${process.env.SUPABASE_URL}/rest/v1/month`,
  perDay: `${process.env.SUPABASE_URL}/rest/v1/perday`,
  visits: `${process.env.SUPABASE_URL}/rest/v1/visits`
};

type View = {
  created_at: string;
  count: number;
};

/**
 * Retrieves the view count for a given pathname.
 */
export async function getViews(pathnameRaw: string): Promise<number> {
  try {
    const pathname = encodeURIComponent(pathnameRaw);
    const request = await fetch(`${URLS.totals}?pathname=eq.${pathname}`, {
      headers: HEADERS,
      method: 'GET'
    });

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

/**
 * Retrieves the view count for a given pathname for a given month.
 */
export async function getViewsPerMonth(pathnameRaw: string): Promise<number> {
  try {
    const pathname = encodeURIComponent(pathnameRaw);
    const request = await fetch(`${URLS.perMonth}?pathname=eq.${pathname}`, {
      headers: HEADERS,
      method: 'GET'
    });

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

/**
 * Retrieves a list of total website views per day.
 */
export async function getViewsPerDay(): Promise<View[]> {
  try {
    const request = await fetch(`${URLS.perDay}`, {
      headers: HEADERS,
      method: 'GET'
    });

    invariant(request.status === 200, 'Error retrieving view');
    invariant(request.ok, 'Error retrieving view');

    const views = (await request.json()) as View[];

    return views;
  } catch (error) {
    console.error('Fetching daily views failed', error);
    return [];
  }
}

/**
 * Tracks a page view for a given pathname, also storing the user agent.
 */
export async function trackView({ origin, pathname, ua }) {
  if (process.env.NODE_ENV === 'development') {
    return console.log('[Tracking pageview]:', pathname);
  }

  try {
    const body = JSON.stringify({ origin, pathname, ua });

    const request = await fetch(URLS.visits, {
      headers: HEADERS,
      body,
      method: 'POST'
    });

    invariant(request.status === 201, 'Error logging analytics');
    invariant(request.ok, 'Error logging analytics');
  } catch (error) {
    console.error('Tracking view failed', error);
  }
}

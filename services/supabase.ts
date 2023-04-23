import invariant from 'tiny-invariant';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  'Content-Type': 'application/json'
};

const URLS = {
  totals: `${SUPABASE_URL}/rest/v1/totals`,
  perMonth: `${SUPABASE_URL}/rest/v1/month`,
  perDay: `${SUPABASE_URL}/rest/v1/perday`,
  week: `${SUPABASE_URL}/rest/v1/week`,
  today: `${SUPABASE_URL}/rest/v1/today`,
  visits: `${SUPABASE_URL}/rest/v1/visits`
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
 * Retrieves a list of total website views of last week
 */
export async function getTotalWeekViews(): Promise<number | undefined> {
  try {
    const request = await fetch(`${URLS.perDay}`, {
      headers: HEADERS,
      method: 'GET'
    });

    invariant(request.status === 200, 'Error retrieving view');
    invariant(request.ok, 'Error retrieving view');

    const list: View[] = await request.json();
    const totals = list.reduce((prev, item) => prev + item.count, 0);

    return totals;
  } catch (error) {
    console.error('Fetching weekly views failed', error);
    return;
  }
}

/**
 * Retrieves a list of total website views of today
 */
export async function getTotalTodayViews(): Promise<number | undefined> {
  try {
    const request = await fetch(`${URLS.today}`, {
      headers: HEADERS,
      method: 'GET'
    });

    invariant(request.status === 200, 'Error retrieving view');
    invariant(request.ok, 'Error retrieving view');

    const list: View[] = await request.json();
    const totals = list.reduce((prev, item) => prev + item.count, 0);

    return totals;
  } catch (error) {
    console.error('Fetching daily views failed', error);
    return;
  }
}

/**
 * Retrieves a list of total website views for all time
 */
export async function getTotalViews(): Promise<number | undefined> {
  try {
    const request = await fetch(`${URLS.totals}`, {
      headers: HEADERS,
      method: 'GET'
    });

    invariant(request.status === 200, 'Error retrieving view');
    invariant(request.ok, 'Error retrieving view');

    const list = await request.json();
    const totals = list.reduce((prev, item) => prev + item.total, 0);

    return totals;
  } catch (error) {
    console.error('Fetching total views failed', error);
    return;
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

// `server-only` guarantees any modules that import code in file
// will never run on the client. Even though this particular api
// doesn't currently use sensitive environment variables, it's
// good practise to add `server-only` preemptively.
import 'server-only';

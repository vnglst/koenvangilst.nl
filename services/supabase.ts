const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

import { createClient } from '@supabase/supabase-js';

import { View } from './types';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false }
});

/**
 * Retrieves the view count for a given pathname.
 */
export async function getViews(pathnameRaw: string): Promise<number> {
  const { data: views, error } = await supabase.from('totals').select('total').eq('pathname', pathnameRaw);

  if (error) {
    console.error('Fetching views failed', error);
    return 0;
  }

  if (!views[0]) {
    return 0;
  }

  return views[0].total;
}

/**
 * Retrieves the view count for a given pathname for a given month.
 */
export async function getViewsPerMonth(pathnameRaw: string): Promise<number> {
  const { data: views, error } = await supabase.from('month').select('count').eq('pathname', pathnameRaw);

  if (error) {
    console.error('Fetching monthly views failed', error);
    return 0;
  }

  if (!views[0]) {
    return 0;
  }

  return views[0].count;
}

/**
 * Retrieves a list of total website views per day.
 */
export async function getViewsPerDay(daysBack: number): Promise<View[]> {
  const { data: views, error } = await supabase
    .from('perday')
    .select('created_at, count')
    // only get views for last x days
    .gt('created_at', new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString());

  if (error) {
    console.error('Fetching daily views failed', error);
    return [];
  }

  return views;
}

/**
 * Retrieves a list of total website views of last week
 */
export async function getTotalWeekViews(): Promise<number> {
  return getViewsPerDay(7).then((views) => {
    return views.reduce((prev, item) => prev + item.count, 0);
  });
}

/**
 * Retrieves a list of total website views of today
 */
export async function getTotalTodayViews(): Promise<number> {
  return getViewsPerDay(1).then((views) => {
    return views.reduce((prev, item) => prev + item.count, 0);
  });
}

/**
 * Retrieves a list of total website views for all time
 */
export async function getTotalViews(): Promise<number> {
  const { data: views, error } = await supabase.from('totals').select('total');

  if (error) {
    console.error('Fetching total views failed', error);
    return 0;
  }

  const list = views.reduce((prev, item) => prev + item.total, 0);

  return list;
}

export async function getLastMonthVisits(): Promise<
  {
    url: string;
    views: number;
  }[]
> {
  const { data: views, error } = await supabase
    .from('month')
    .select('count, pathname')
    .order('count', { ascending: false })
    .filter('count', 'gt', 2);

  if (error) {
    console.error('Fetching total views failed', error);
    return [];
  }

  const list = views.map((item) => ({
    url: item.pathname,
    views: item.count
  }));

  return list;
}

/**
 * Tracks a page view for a given pathname, also storing the user agent.
 */
export async function trackView({ origin, pathname, ua }) {
  if (process.env.NODE_ENV === 'development') {
    // console.log('[Tracking pageview]:', pathname);
    return;
  }

  const { error } = await supabase.from('visits').insert([{ origin, pathname, ua }]);

  if (error) {
    console.error('Tracking view failed', error);
  }
}

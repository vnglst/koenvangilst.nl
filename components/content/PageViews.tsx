'use client';

import useSWR from 'swr';

import { fetcher } from 'lib/fetcher';

type PageViewsProps = {
  path: string;
};

type StatsResponse = {
  page: string;
  visitors: number;
  pageviews: number;
  error?: string;
};

export function PageViews({ path }: PageViewsProps) {
  const { data, error } = useSWR<StatsResponse>(`/api/stats?page=${encodeURIComponent(path)}`, fetcher, {
    // Revalidate every 5 minutes
    refreshInterval: 5 * 60 * 1000,
    // Don't revalidate on focus
    revalidateOnFocus: false
  });

  if (error || data?.error) {
    // Silently fail - don't show errors to users
    return null;
  }

  if (!data) {
    // Loading state - show placeholder
    return <span className="text-gray-600 dark:text-gray-400">— views</span>;
  }

  const views = data.pageviews || 0;

  return (
    <span className="text-gray-600 dark:text-gray-400">
      {views.toLocaleString()} {views === 1 ? 'view' : 'views'}
    </span>
  );
}

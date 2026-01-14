'use client';

import useSWR from 'swr';
import { fetcher } from 'lib/fetcher';
import { StatsSection } from './StatsSection';

type PageStat = {
  page: string;
  visitors: number;
  pageviews: number;
};

type StatsResponse = {
  period: string;
  results: PageStat[];
  error?: string;
};

const TIME_PERIODS = [
  { key: 'all', label: 'All Time', description: 'Most visited pages since site inception' },
  { key: 'year', label: 'This Year', description: 'Top pages from the last 12 months' },
  { key: 'month', label: 'This Month', description: 'Most popular pages this month' },
  { key: 'week', label: 'This Week', description: 'Trending pages in the last 7 days' }
] as const;

export function DashboardStats() {
  return (
    <div className="space-y-8">
      {TIME_PERIODS.map((period) => (
        <StatsPeriod key={period.key} period={period.key} label={period.label} description={period.description} />
      ))}
    </div>
  );
}

type StatsPeriodProps = {
  period: string;
  label: string;
  description: string;
};

function StatsPeriod({ period, label, description }: StatsPeriodProps) {
  const { data, error } = useSWR<StatsResponse>(`/api/dashboard-stats?period=${period}&limit=10`, fetcher, {
    // Revalidate every 5 minutes
    refreshInterval: 5 * 60 * 1000,
    // Don't revalidate on focus
    revalidateOnFocus: false
  });

  if (error || data?.error) {
    return (
      <StatsSection title={label} description={description} isLoading={false}>
        <p className="text-red-600 dark:text-red-400">Failed to load stats</p>
      </StatsSection>
    );
  }

  if (!data) {
    return <StatsSection title={label} description={description} isLoading={true} />;
  }

  return (
    <StatsSection title={label} description={description} isLoading={false}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Rank</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Page</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Visitors</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Page Views
              </th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((stat, index) => (
              <tr key={stat.page} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-400">#{index + 1}</td>
                <td className="py-3 px-2">
                  <a
                    href={stat.page}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all"
                  >
                    {stat.page}
                  </a>
                </td>
                <td className="py-3 px-2 text-right text-sm text-gray-900 dark:text-gray-100 font-medium">
                  {stat.visitors.toLocaleString()}
                </td>
                <td className="py-3 px-2 text-right text-sm text-gray-900 dark:text-gray-100 font-medium">
                  {stat.pageviews.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </StatsSection>
  );
}

'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from 'lib/fetcher';
import { StatsSection } from './StatsSection';
import { AggregateStats } from './AggregateStats';
import { VisitorTrendsChart } from './VisitorTrendsChart';

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
  { key: '30d', label: 'Last 30 Days', chartPeriod: '30d' as const },
  { key: '7d', label: 'Last 7 Days', chartPeriod: '7d' as const },
  { key: '12mo', label: 'Last 12 Months', chartPeriod: '12mo' as const }
] as const;

const TOP_PAGES_PERIODS = [
  { key: 'all', label: 'All Time', description: 'Most visited pages since site inception' },
  { key: 'year', label: 'This Year', description: 'Top pages from the last 12 months' },
  { key: 'month', label: 'This Month', description: 'Most popular pages this month' },
  { key: 'week', label: 'This Week', description: 'Trending pages in the last 7 days' }
] as const;

export function DashboardStats() {
  const [selectedPeriod, setSelectedPeriod] = useState<(typeof TIME_PERIODS)[number]>(TIME_PERIODS[0]);

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex flex-wrap gap-2">
        {TIME_PERIODS.map((period) => (
          <button
            key={period.key}
            onClick={() => setSelectedPeriod(period)}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
              selectedPeriod.key === period.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Aggregate Stats Cards */}
      <AggregateStats period={selectedPeriod.key} />

      {/* Visitor Trends Chart */}
      <VisitorTrendsChart period={selectedPeriod.chartPeriod} title={`Visitor Trends - ${selectedPeriod.label}`} />

      {/* Top Pages by Period */}
      <div className="mt-8 md:mt-12">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6">
          Most Visited Pages
        </h2>
        <div className="space-y-6 md:space-y-8">
          {TOP_PAGES_PERIODS.map((period) => (
            <StatsPeriod key={period.key} period={period.key} label={period.label} description={period.description} />
          ))}
        </div>
      </div>
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
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 md:py-3 px-2 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                  #
                </th>
                <th className="text-left py-2 md:py-3 px-2 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Page
                </th>
                <th className="text-right py-2 md:py-3 px-2 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Visitors
                </th>
                <th className="text-right py-2 md:py-3 px-2 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Views
                </th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((stat, index) => (
                <tr
                  key={stat.page}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <td className="py-2 md:py-3 px-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    {index + 1}
                  </td>
                  <td className="py-2 md:py-3 px-2">
                    <a
                      href={stat.page}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-xs md:text-sm break-all line-clamp-2 md:line-clamp-none"
                    >
                      {stat.page}
                    </a>
                  </td>
                  <td className="py-2 md:py-3 px-2 text-right text-xs md:text-sm text-gray-900 dark:text-gray-100 font-medium whitespace-nowrap">
                    {stat.visitors.toLocaleString()}
                  </td>
                  <td className="py-2 md:py-3 px-2 text-right text-xs md:text-sm text-gray-900 dark:text-gray-100 font-medium whitespace-nowrap">
                    {stat.pageviews.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </StatsSection>
  );
}

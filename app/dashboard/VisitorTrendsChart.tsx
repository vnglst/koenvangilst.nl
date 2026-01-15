'use client';

import useSWR from 'swr';
import { fetcher } from 'lib/fetcher';
import { Chart } from './Chart';
import type { ECBasicOption } from 'echarts/types/dist/shared';

type TimeseriesDataPoint = {
  date: string;
  visitors: number;
  pageviews: number;
};

type TimeseriesResponse = {
  period: string;
  results: TimeseriesDataPoint[];
  error?: string;
};

type VisitorTrendsChartProps = {
  period?: '7d' | '30d' | '6mo' | '12mo';
  title?: string;
};

export function VisitorTrendsChart({ period = '30d', title = 'Visitor Trends' }: VisitorTrendsChartProps) {
  const { data, error } = useSWR<TimeseriesResponse>(
    `/api/dashboard-stats/timeseries?period=${period}`,
    fetcher,
    {
      refreshInterval: 5 * 60 * 1000,
      revalidateOnFocus: false
    }
  );

  if (error || data?.error) {
    return (
      <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <p className="text-red-600 dark:text-red-400">Failed to load chart data</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>
        </div>
      </div>
    );
  }

  const dates = data.results.map((item) => item.date);
  const visitors = data.results.map((item) => item.visitors);
  const pageviews = data.results.map((item) => item.pageviews);

  const options: ECBasicOption = {
    title: {
      text: title,
      left: 'left',
      top: 10
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['Visitors', 'Page Views'],
      top: 10,
      right: 60
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLabel: {
        rotate: 45,
        formatter: (value: string) => {
          // Format date for better readability
          const date = new Date(value);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Visitors',
        type: 'line',
        data: visitors,
        smooth: true,
        lineStyle: {
          width: 3
        },
        areaStyle: {
          opacity: 0.3
        }
      },
      {
        name: 'Page Views',
        type: 'line',
        data: pageviews,
        smooth: true,
        lineStyle: {
          width: 3
        },
        areaStyle: {
          opacity: 0.2
        }
      }
    ]
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
      <Chart options={options} className="h-[400px] w-full" />
    </div>
  );
}

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
      <div className="w-full overflow-hidden border border-dashed border-gray-400 dark:border-none p-6">
        <p className="text-red-600 dark:text-red-400">Failed to load chart data</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full overflow-hidden border border-dashed border-gray-400 dark:border-none">
        <div className="h-[300px] md:h-[400px] flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>
        </div>
      </div>
    );
  }

  const dates = data.results.map((item) => item.date);
  const visitors = data.results.map((item) => item.visitors);
  const pageviews = data.results.map((item) => item.pageviews);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const options: ECBasicOption = {
    grid: {
      top: 100,
      bottom: 80,
      left: 15,
      right: 15
    },
    title: {
      text: title,
      subtext: `Data from Plausible Analytics • www.koenvangilst.nl • ${currentDate}`,
      subtextStyle: {
        lineHeight: 18
      },
      top: 10,
      left: 10
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['Visitors', 'Page Views'],
      bottom: 10,
      left: 'center'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      splitLine: {
        show: false
      },
      axisLabel: {
        rotate: 45,
        formatter: (value: string) => {
          const date = new Date(value);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: 'Visitors',
        type: 'line',
        data: visitors,
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#2196f3'
            },
            {
              offset: 1,
              color: '#cbf3ff'
            }
          ]
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#19c9ff'
              },
              {
                offset: 1,
                color: '#2196f3'
              }
            ]
          }
        }
      },
      {
        name: 'Page Views',
        type: 'line',
        data: pageviews,
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#64b5f6'
            },
            {
              offset: 1,
              color: '#e3f2fd'
            }
          ]
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#90caf9'
              },
              {
                offset: 1,
                color: '#64b5f6'
              }
            ]
          }
        }
      }
    ]
  };

  return (
    <div className="w-full overflow-hidden border border-dashed border-gray-400 dark:border-none">
      <Chart options={options} className="h-[300px] md:h-[400px] w-full" />
    </div>
  );
}

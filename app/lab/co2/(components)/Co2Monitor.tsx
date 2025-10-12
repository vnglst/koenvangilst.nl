'use client';

import useSWR from 'swr';

import { fetcher } from 'lib/fetcher';
import { Co2Reading } from 'services/aranet';

export function Co2Monitor() {
  const { data: reading } = useSWR<Co2Reading>('/api/co2', fetcher, {
    refreshInterval: 30_000,
    revalidateOnFocus: true
  });

  const timestamp = reading ? (
    new Date(reading.timestamp * 1000).toLocaleTimeString('en-UK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  ) : (
    <br />
  );

  return (
    <div className="not-prose w-full pt-4 pb-4">
      <pre className="mb-6 w-full bg-transparent text-center text-gray-600 dark:text-gray-400">{timestamp}</pre>
      <div className="mb-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricCard header="CO2" metric={reading?.co2} unit="ppm" />
        <MetricCard header="Temperature" metric={reading?.temperature} unit="°C" />
        <MetricCard header="Humidity" metric={reading?.humidity} unit="%" />
        <MetricCard header="Pressure" metric={reading?.pressure} unit="hPa" />
      </div>
    </div>
  );
}

type MetricCardProps = {
  header: string;
  metric?: number;
  unit: string;
};

function MetricCard({ header, metric, unit }: MetricCardProps) {
  return (
    <div className="w-full border border-dashed border-gray-400 p-4 text-gray-900 dark:text-gray-100">
      <div className="flex items-center">{header}</div>
      <p className="spacing-sm mt-2 text-3xl font-bold text-black dark:text-white">
        {metric ? metric.toLocaleString() + ' ' + unit : 'no data'}
      </p>
    </div>
  );
}

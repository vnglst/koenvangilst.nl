'use client';

import useSWR from 'swr';

import { fetcher } from 'lib/fetcher';

type Reading = {
  timestamp: number;
  co2: number;
  temperature: number;
  humidity: number;
  pressure: number;
};

export function Co2Meter() {
  const { data: reading } = useSWR<Reading>('/api/co2', fetcher, {
    refreshInterval: 1000,
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
    <div className="w-full">
      <pre className="mb-6 w-full text-center text-gray-600 dark:text-gray-400">
        {timestamp}
      </pre>
      <div className="mb-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricCard header="CO2" metric={reading?.co2} unit="ppm" />
        <MetricCard
          header="Temperature"
          metric={reading?.temperature}
          unit="°C"
        />
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

// TODO: make re-usable and move to components
function MetricCard({ header, metric, unit }: MetricCardProps) {
  return (
    <div className="min-h-[102px] w-full rounded-lg border border-dashed border-gray-400 bg-white p-4 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="flex items-center">{header}</div>
      <p className="spacing-sm mt-2 text-3xl font-bold text-black dark:text-white">
        {metric ? metric.toLocaleString() + ' ' + unit : ''}
      </p>
    </div>
  );
}

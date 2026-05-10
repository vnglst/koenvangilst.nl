import type { JSX } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { fetcher } from '#/lib/fetcher';

import { RainClient } from './RainChart';
import { SunshineClient } from './Sunshine';
import { TemperatureClient } from './TemperatureChart';

const DATA_URL = 'https://raw.githubusercontent.com/vnglst/dutch-climate-data/main/data/yearly-weather-data.json';

type AnomalyProps = {
  type: 'sunshine' | 'rain' | 'temperature';
  look: 'blog' | 'dashboard';
};

export function WeatherAnomaly({ type, look = 'blog' }: AnomalyProps) {
  const { data, error } = useQuery({ queryKey: [DATA_URL], queryFn: () => fetcher(DATA_URL) });

  const classNameForBlog = 'my-4 aspect-[1/1]';
  const classNameForDashboard = 'aspect-[3/5] min-h-0 w-full md:aspect-square';
  const className = look === 'blog' ? classNameForBlog : classNameForDashboard;

  if (error) return <div className="text-sm text-red-500">Failed to load weather data</div>;
  if (!data) return <div className={`${className} animate-pulse bg-gray-100 dark:bg-gray-800`} />;

  const parsed = Data.safeParse(data);
  if (!parsed.success) return null;

  let Component: JSX.Element | null = null;
  if (type === 'sunshine') Component = <SunshineClient data={parsed.data} className={className} />;
  else if (type === 'rain') Component = <RainClient data={parsed.data} className={className} />;
  else Component = <TemperatureClient data={parsed.data} className={className} />;

  return Component;
}

const Data = z.object({
  timestamp: z.string(),
  mean_rainfall: z.number(),
  mean_sunshine: z.number(),
  mean_temperature: z.number(),
  rainfall_anomalies: z.array(z.number()),
  sunshine_anomalies: z.array(z.number()),
  temperature_anomalies: z.array(z.number()),
  rainfall_trend: z.array(z.number()),
  sunshine_trend: z.array(z.number()),
  temperature_trend: z.array(z.number()),
  temperature_worst_case: z.number(),
  temperature_best_case: z.number(),
  max_temperature_anomaly: z.number(),
  min_temperature_anomaly: z.number(),
  last_temperature_anomaly: z.number(),
  last_temperature_trend: z.number(),
  years: z.array(z.string()),
  forecast_years: z.array(z.string())
});

export type Data = z.infer<typeof Data>;

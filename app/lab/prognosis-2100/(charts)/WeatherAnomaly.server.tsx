import { type JSX, Suspense } from 'react';
import { z } from 'zod';

import { fetcher } from 'lib/fetcher';

import { RainClient } from './Rain.client';
import { SunshineClient } from './Sunshine';
import { TemperatureClient } from './Temperature.client';

const DATA_URL = 'https://raw.githubusercontent.com/vnglst/dutch-climate-data/main/data/yearly-weather-data.json';

type AnomalyProps = {
  type: 'sunshine' | 'rain' | 'temperature';
  look: 'blog' | 'dashboard';
};

export async function WeatherAnomaly({ type, look = 'blog' }: AnomalyProps) {
  const data = await fetchData();
  const classNameForBlog = 'my-4 aspect-[2/1] min-h-[60vh]';
  const classNameForDashboard = 'aspect-[3/5] min-h-0 w-full md:aspect-square';
  const className = look === 'blog' ? classNameForBlog : classNameForDashboard;

  let Component: JSX.Element | null = null;

  if (type === 'sunshine') {
    Component = <SunshineClient data={data} className={className} />;
  } else if (type === 'rain') {
    Component = <RainClient data={data} className={className} />;
  } else if (type === 'temperature') {
    Component = <TemperatureClient data={data} className={className} />;
  }

  return <Suspense fallback={<div>Loading...</div>}>{Component}</Suspense>;
}

async function fetchData() {
  const data = await fetcher(DATA_URL, {
    next: { revalidate: 60 * 60 * 24 * 30 } // monthly
  });
  const parsedData = Data.parse(data);
  return parsedData;
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

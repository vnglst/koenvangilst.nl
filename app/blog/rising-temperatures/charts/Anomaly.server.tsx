import { z } from 'zod';

import { fetcher } from 'lib/fetcher';

import { RainClient } from './Rain.client';
import { SunshineClient } from './Sunshine';
import { TemperatureClient } from './Temperature.client';

const DATA_URL =
  'https://raw.githubusercontent.com/vnglst/dutch-climate-data/main/data/yearly-weather-data.json';

type AnomalyProps = {
  type: 'sunshine' | 'rain' | 'temperature';
};

export async function Anomaly({ type }: AnomalyProps) {
  const data = await fetchData();

  if (type === 'sunshine') {
    return <SunshineClient data={data} />;
  }

  if (type === 'rain') {
    return <RainClient data={data} />;
  }

  if (type === 'temperature') {
    return <TemperatureClient data={data} />;
  }

  return null;
}

async function fetchData() {
  const data = await fetcher(DATA_URL, { next: { revalidate: 60 * 5 } });
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
  years: z.array(z.string())
});

export type Data = z.infer<typeof Data>;
export type Anomalies = Data['rainfall_anomalies'];

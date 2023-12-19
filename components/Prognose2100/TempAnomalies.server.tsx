import { z } from 'zod';

import { fetcher } from 'lib/fetcher';

import { TempAnomaliesClient } from './TempAnomalies.client';

const DATA_URL =
  'https://raw.githubusercontent.com/vnglst/dutch-climate-data/main/data/temperature-anomalies.json';

export async function TemperatureAnomalies() {
  const anomalies = await fetchAnomalies();
  return <TempAnomaliesClient anomalies={anomalies} />;
}

async function fetchAnomalies() {
  const data = await fetcher(DATA_URL, { next: { revalidate: 60 * 5 } });
  const parsedData = Anomalies.parse(data);
  return parsedData;
}

const Anomalies = z.object({
  timestamp: z.string(),
  years: z.array(z.string()),
  data: z.array(z.number().nullable())
});

export type Anomalies = z.infer<typeof Anomalies>;
export type Temperatures = Anomalies['data'];

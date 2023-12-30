import { z } from 'zod';

import { fetcher } from 'lib/fetcher';

import { RainClient } from './Rain.client';
// import data from local json file
import data from './rainfall.json';

// const DATA_URL =
//   'https://raw.githubusercontent.com/vnglst/dutch-climate-data/main/data/temperature-anomalies.json';

export async function Rain() {
  const data = await fetchData();
  return <RainClient data={data} />;
}

async function fetchData() {
  // const data = await fetcher(DATA_URL, { next: { revalidate: 60 * 5 } });
  // load data from local fil
  const parsedData = Data.parse(data);
  return parsedData;
}

const Data = z.object({
  timestamp: z.string(),
  mean: z.number(),
  anomalies: z.array(z.number()),
  trend: z.array(z.number()),
  years: z.array(z.string())
});

export type Data = z.infer<typeof Data>;
export type Anomalies = Data['anomalies'];

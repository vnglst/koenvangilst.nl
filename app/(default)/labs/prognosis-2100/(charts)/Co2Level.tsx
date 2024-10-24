import { Suspense } from 'react';
import { z } from 'zod';

import { fetcher } from 'lib/fetcher';

import { Co2LevelClient } from './Co2Level.client';

const DATA_URL = 'https://raw.githubusercontent.com/vnglst/dutch-climate-data/main/data/co2_levels.json';

export async function Co2Level() {
  const data = await fetchData();

  return (
    <Suspense>
      <Co2LevelClient data={data} className="aspect-[3/5] min-h-0 w-full md:aspect-square" />
    </Suspense>
  );
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
  co2_levels: z.array(z.number()),
  best_case: z.number(),
  worst_case: z.number(),
  last_co2_level: z.number(),
  years: z.array(z.string()),
  forecast_years: z.array(z.string())
});

export type DataType = z.infer<typeof Data>;

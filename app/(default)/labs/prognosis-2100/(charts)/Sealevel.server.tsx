import { Suspense } from 'react';
import { z } from 'zod';

import { fetcher } from 'lib/fetcher';

import { SealevelClient } from './Sealevel.client';

const DATA_URL =
  'https://raw.githubusercontent.com/vnglst/dutch-climate-data/main/data/sealevels.json';

export async function Sealevel() {
  const data = await fetchData();

  return (
    <Suspense>
      <SealevelClient
        data={data}
        className="aspect-[3/5] min-h-0 w-full md:aspect-square"
      />
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
  sealevels: z.array(z.number()),
  last_sealevel: z.number(),
  years: z.array(z.string()),
  forecast_years: z.array(z.string()),
  best_case: z.number(),
  worst_case: z.number()
});

export type DataType = z.infer<typeof Data>;

import { z } from 'zod';

import { fetcher } from 'lib/fetcher';

import { SealevelClient } from './Sealevel.client';

const DATA_URL =
  'https://raw.githubusercontent.com/vnglst/dutch-climate-data/main/data/sealevels.json';

export async function Sealevel() {
  const data = await fetchData();

  return (
    <SealevelClient
      data={data}
      className="aspect-[3/5] min-h-0 w-full md:aspect-square"
    />
  );
}

async function fetchData() {
  const data = await fetcher(DATA_URL, { next: { revalidate: 60 * 5 } });
  const parsedData = Data.parse(data);
  return parsedData;
}

const Data = z.object({
  timestamp: z.string(),
  sealevels: z.array(z.tuple([z.string(), z.number()]))
});

export type DataType = z.infer<typeof Data>;

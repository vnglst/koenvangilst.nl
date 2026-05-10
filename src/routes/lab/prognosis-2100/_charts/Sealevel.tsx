import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { fetcher } from '#/lib/fetcher';

import { SealevelClient } from './SealevelChart';

const DATA_URL = 'https://raw.githubusercontent.com/vnglst/dutch-climate-data/main/data/sealevels.json';

export function Sealevel() {
  const { data, error } = useQuery({ queryKey: [DATA_URL], queryFn: () => fetcher(DATA_URL) });

  if (error) return <div className="text-sm text-red-500">Failed to load sea level data</div>;
  if (!data) return <div className="aspect-[3/5] animate-pulse bg-gray-100 dark:bg-gray-800 md:aspect-square" />;

  const parsed = Data.safeParse(data);
  if (!parsed.success) return null;

  return <SealevelClient data={parsed.data} className="aspect-[3/5] min-h-0 w-full md:aspect-square" />;
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

import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { SealevelClient } from './SealevelChart';

const DATA_URL = 'https://raw.githubusercontent.com/vnglst/dutch-climate-data/main/data/sealevels.json';

export function Sealevel() {
  const { data, error } = useQuery({ queryKey: [DATA_URL], queryFn: () => fetch(DATA_URL).then((r) => r.json()) });

  if (error) return <div className="text-sm text-red-500">Failed to load sea level data</div>;
  if (!data) return <div className="dashboard-chart animate-pulse bg-[var(--surface)]" />;

  const parsed = Data.safeParse(data);
  if (!parsed.success) return null;

  return <SealevelClient data={parsed.data} className="dashboard-chart" />;
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

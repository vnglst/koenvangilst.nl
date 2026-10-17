import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { Co2LevelClient } from './Co2LevelChart';

const DATA_URL = 'https://raw.githubusercontent.com/vnglst/dutch-climate-data/main/data/co2_levels.json';

export function Co2Level() {
  const { data, error } = useQuery({ queryKey: [DATA_URL], queryFn: () => fetch(DATA_URL).then((r) => r.json()) });

  if (error) return <div className="text-sm text-red-500">Failed to load CO2 data</div>;
  if (!data) return <div className="dashboard-chart animate-pulse bg-[var(--surface)]" />;

  const parsed = Data.safeParse(data);
  if (!parsed.success) return null;

  return <Co2LevelClient data={parsed.data} className="dashboard-chart" />;
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

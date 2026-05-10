import useSWR from 'swr';
import { z } from 'zod';

import { fetcher } from '#/lib/fetcher';

import { RainHeatmapClient } from './RainHeatmapChart';
import { SunshineHeatmapClient } from './SunshineHeatmapChart';
import { TemperatureHeatmapClient } from './TemperatureHeatmapChart';

const DATA_URL = 'https://raw.githubusercontent.com/vnglst/dutch-climate-data/main/data/monthly-weather-data.json';

export function WeatherHeatmap({ type }: { type: 'rain' | 'sunshine' | 'temperature' }) {
  const { data, error } = useSWR(DATA_URL, fetcher);

  if (error) return <div className="text-sm text-red-500">Failed to load heatmap data</div>;
  if (!data) return <div className="aspect-[3/1] animate-pulse bg-gray-100 dark:bg-gray-800" />;

  const parsed = Data.safeParse(data);
  if (!parsed.success) return null;

  if (type === 'rain') return <RainHeatmapClient data={parsed.data} />;
  if (type === 'sunshine') return <SunshineHeatmapClient data={parsed.data} />;
  return <TemperatureHeatmapClient data={parsed.data} />;
}

const Data = z.object({
  timestamp: z.string(),
  years: z.array(z.string()),
  rainfall_heatmap: z.array(z.tuple([z.string(), z.number(), z.number().nullable()])),
  sunshine_heatmap: z.array(z.tuple([z.string(), z.number(), z.number().nullable()])),
  temperature_heatmap: z.array(z.tuple([z.string(), z.number(), z.number().nullable()]))
});

export type Data = z.infer<typeof Data>;
type Heatmap = Data['rainfall_heatmap'];
export type HeatmapValue = Heatmap[0];

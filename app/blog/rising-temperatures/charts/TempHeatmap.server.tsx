import { z } from 'zod';

import { fetcher } from 'lib/fetcher';

import { TempHeatmapClient } from './TempHeatmap.client';

const DATA_URL =
  'https://raw.githubusercontent.com/vnglst/dutch-climate-data/main/data/temperature-heatmap.json';

export async function TemperatureHeatmap() {
  const heatmap = await fetchHeatmap();
  return <TempHeatmapClient heatmap={heatmap} />;
}

async function fetchHeatmap() {
  const data = await fetcher(DATA_URL, { next: { revalidate: 60 * 5 } });
  const parsedData = Heatmap.parse(data);
  return parsedData;
}

const Heatmap = z.object({
  timestamp: z.string(),
  years: z.array(z.string()),
  data: z.array(z.tuple([z.number(), z.string(), z.number().nullable()]))
});

export type Heatmap = z.infer<typeof Heatmap>;
export type HeatMapData = Heatmap['data'];
export type HeatMapValue = HeatMapData[0];

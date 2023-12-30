import { z } from 'zod';

import { fetcher } from 'lib/fetcher';

// const DATA_URL =
// 'https://raw.githubusercontent.com/vnglst/dutch-climate-data/main/data/temperature-heatmap.json';
import data from './rainfall-heatmap.json';
import { RainHeatmapClient } from './RainHeatmap.client';

export async function RainHeatmap() {
  const heatmap = await fetchHeatmap();
  return <RainHeatmapClient data={heatmap} />;
}

async function fetchHeatmap() {
  // const data = await fetcher(DATA_URL, { next: { revalidate: 60 * 5 } });
  // load data from local file
  const parsedData = Data.parse(data);
  return parsedData;
}

const Data = z.object({
  timestamp: z.string(),
  years: z.array(z.string()),
  rainfall_heatmap: z.array(
    z.tuple([z.string(), z.number(), z.number().nullable()])
  ),
  sunshine_heatmap: z.array(
    z.tuple([z.string(), z.number(), z.number().nullable()])
  )
});

export type Data = z.infer<typeof Data>;
export type Heatmap = Data['rainfall_heatmap'];
export type HeatmapValue = Heatmap[0];

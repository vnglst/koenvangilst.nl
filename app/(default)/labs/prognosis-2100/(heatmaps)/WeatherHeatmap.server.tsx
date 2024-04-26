import { z } from 'zod';

import { fetcher } from 'lib/fetcher';

import { RainHeatmapClient } from './RainHeatmap.client';
import { SunshineHeatmapClient } from './SunshineHeatmap.client';
import { TemperatureHeatmapClient } from './TemperatureHeatmap.client';

const DATA_URL =
  'https://raw.githubusercontent.com/vnglst/dutch-climate-data/main/data/monthly-weather-data.json';

export async function WeatherHeatmap({ type }) {
  const heatmap = await fetchHeatmapData();

  if (type === 'rain') return <RainHeatmapClient data={heatmap} />;
  if (type === 'sunshine') return <SunshineHeatmapClient data={heatmap} />;
  if (type === 'temperature')
    return <TemperatureHeatmapClient data={heatmap} />;

  return null;
}

async function fetchHeatmapData() {
  const data = await fetcher(DATA_URL, {
    next: { revalidate: 60 * 60 * 24 * 30 } // monthly
  });
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
  ),
  temperature_heatmap: z.array(
    z.tuple([z.string(), z.number(), z.number().nullable()])
  )
});

export type Data = z.infer<typeof Data>;
export type Heatmap = Data['rainfall_heatmap'];
export type HeatmapValue = Heatmap[0];

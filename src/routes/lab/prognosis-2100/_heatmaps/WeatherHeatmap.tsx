import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { hoursFormatter, mmFormatter, temperatureFormatter } from '#/lib/formatters';
import { HeatmapChart, type HeatmapChartProps } from './HeatmapChart';

const HEATMAPS = {
  rain: {
    dataKey: 'rainfall_heatmap',
    title: 'Monthly Rainfall Anomalies De Bilt',
    saveAsImageName: 'monthly-rainfall-anomalies',
    visualMapRange: { min: -50, max: 150 },
    colors: ['#ffffff', '#44d6ff', '#0022ff'],
    tooltipFormatter: mmFormatter
  },
  sunshine: {
    dataKey: 'sunshine_heatmap',
    title: 'Monthly Sunshine Anomalies De Bilt',
    saveAsImageName: 'monthly-sunshine-anomalies',
    visualMapRange: { min: -50, max: 120 },
    colors: ['#ffffff', '#ffcc6a', '#ff9662'],
    tooltipFormatter: hoursFormatter
  },
  temperature: {
    dataKey: 'temperature_heatmap',
    title: 'Monthly Temperature Anomalies De Bilt',
    saveAsImageName: 'monthly-temperature-anomalies',
    visualMapRange: { min: -5, max: 5 },
    colors: ['#2196f3', '#ffffff', '#ff9662'],
    tooltipFormatter: temperatureFormatter
  }
} satisfies Record<string, Omit<HeatmapChartProps, 'data'>>;

const DATA_URL = 'https://raw.githubusercontent.com/vnglst/dutch-climate-data/main/data/monthly-weather-data.json';

export function WeatherHeatmap({ type }: { type: 'rain' | 'sunshine' | 'temperature' }) {
  const { data, error } = useQuery({ queryKey: [DATA_URL], queryFn: () => fetch(DATA_URL).then((r) => r.json()) });

  if (error) return <div className="text-sm text-red-500">Failed to load heatmap data</div>;
  if (!data) return <div className="aspect-[3/1] animate-pulse bg-[var(--surface)]" />;

  const parsed = Data.safeParse(data);
  if (!parsed.success) return null;

  return <HeatmapChart data={parsed.data} {...HEATMAPS[type]} />;
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

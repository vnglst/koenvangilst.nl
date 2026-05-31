import { mmFormatter } from '#/lib/formatters';

import { HeatmapChart } from './HeatmapChart';
import type { Data } from './WeatherHeatmap';

type RainHeatmapProps = {
  data: Data;
};

export function RainHeatmapClient({ data }: RainHeatmapProps) {
  return (
    <HeatmapChart
      data={data}
      dataKey="rainfall_heatmap"
      title="Monthly Rainfall Anomalies De Bilt"
      saveAsImageName="monthly-rainfall-anomalies"
      visualMapRange={{ min: -50, max: 150 }}
      colors={['#ffffff', '#44d6ff', '#0022ff']}
      tooltipFormatter={mmFormatter}
    />
  );
}

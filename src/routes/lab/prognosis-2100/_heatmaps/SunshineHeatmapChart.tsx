import { hoursFormatter } from '#/lib/formatters';

import { HeatmapChart } from './HeatmapChart';
import type { Data } from './WeatherHeatmap';

type SunshineHeatmapProps = {
  data: Data;
};

export function SunshineHeatmapClient({ data }: SunshineHeatmapProps) {
  return (
    <HeatmapChart
      data={data}
      dataKey="sunshine_heatmap"
      title="Monthly Sunshine Anomalies De Bilt"
      saveAsImageName="monthly-sunshine-anomalies"
      visualMapRange={{ min: -50, max: 120 }}
      colors={['#ffffff', '#ffcc6a', '#ff9662']}
      tooltipFormatter={hoursFormatter}
    />
  );
}

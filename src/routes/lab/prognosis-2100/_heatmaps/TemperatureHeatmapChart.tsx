import { temperatureFormatter } from '#/lib/formatters';

import { HeatmapChart } from './HeatmapChart';
import type { Data } from './WeatherHeatmap';

type TemperatureHeatmapProps = {
  data: Data;
};

export function TemperatureHeatmapClient({ data }: TemperatureHeatmapProps) {
  return (
    <HeatmapChart
      data={data}
      dataKey="temperature_heatmap"
      title="Monthly Temperature Anomalies De Bilt"
      saveAsImageName="monthly-temperature-anomalies"
      visualMapRange={{ min: -5, max: 5 }}
      colors={['#2196f3', '#ffffff', '#ff9662']}
      tooltipFormatter={temperatureFormatter}
    />
  );
}

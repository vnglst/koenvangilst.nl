import { dateFormatter } from '#/lib/formatters';

import { Chart } from '../_charts/Chart';
import { ChartSection } from '../_charts/ChartSection';
import { MONTHS } from '../_charts/utils';
import type { Data, HeatmapValue } from './WeatherHeatmap';

type HeatmapChartProps = {
  data: Data;
  dataKey: 'temperature_heatmap' | 'rainfall_heatmap' | 'sunshine_heatmap';
  title: string;
  saveAsImageName: string;
  visualMapRange: { min: number; max: number };
  colors: string[];
  tooltipFormatter: (value: number) => string;
};

export function HeatmapChart({
  data,
  dataKey,
  title,
  saveAsImageName,
  visualMapRange,
  colors,
  tooltipFormatter
}: HeatmapChartProps) {
  const options = generateOptions(data, dataKey, title, saveAsImageName, visualMapRange, colors, tooltipFormatter);

  return (
    <ChartSection>
      <Chart options={options} className="aspect-[5/1] min-h-[300px]" />
    </ChartSection>
  );
}

function generateOptions(
  heatmap: Data,
  dataKey: string,
  title: string,
  saveAsImageName: string,
  visualMapRange: { min: number; max: number },
  colors: string[],
  tooltipFormatter: (value: number) => string
) {
  return {
    grid: {
      top: 90,
      bottom: 25,
      left: 20,
      right: 20,
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {
          name: saveAsImageName
        }
      }
    },
    title: [
      {
        text: title,
        subtext: `KNMI • www.koenvangilst.nl • ${dateFormatter(heatmap.timestamp)}`,
        subtextStyle: {
          lineHeight: 18
        },
        top: 0,
        left: 0
      }
    ],
    xAxis: {
      type: 'category',
      data: heatmap.years
    },
    yAxis: [
      {
        type: 'category',
        data: MONTHS,
        position: 'left'
      },
      {
        type: 'category',
        data: MONTHS,
        position: 'right'
      }
    ],
    visualMap: {
      min: visualMapRange.min,
      max: visualMapRange.max,
      calculable: true,
      orient: 'horizontal',
      top: 10,
      left: 'center',
      type: 'continuous',
      inRange: {
        color: colors
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params: { value: HeatmapValue }) {
        const [year, month, value] = params.value;
        const monthStr = MONTHS[month];
        const formatted = value !== null ? tooltipFormatter(value) : 'N/A';
        return `${monthStr}. ${year}<br/>Anomaly <b style="padding-left: 15px">${formatted}</b>`;
      }
    },
    series: [
      {
        type: 'heatmap',
        data: (heatmap as Record<string, unknown>)[dataKey],
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.25)'
          }
        }
      }
    ]
  };
}

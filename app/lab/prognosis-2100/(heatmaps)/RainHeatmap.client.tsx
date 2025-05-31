'use client';

import { dateFormatter, mmFormatter } from 'lib/formatters';

import { Chart } from '../(charts)/Chart';
import { Data, HeatmapValue } from './WeatherHeatmap.server';

type RainHeatmapProps = {
  data: Data;
};

export function RainHeatmapClient({ data }: RainHeatmapProps) {
  const options = generateOptions(data);

  return (
    <div className="lg:full-bleed-20 my-4 overflow-x-auto overflow-y-hidden border border-dashed border-gray-400 dark:border-none md:min-h-0">
      <Chart options={options} className="aspect-[5/1] min-h-[250px]" />
    </div>
  );
}

function generateOptions(heatmap: Data) {
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

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
          name: 'monthly-rainfall-anomalies'
        }
      }
    },
    title: [
      {
        text: 'Monthly Rainfall Anomalies De Bilt',
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
      min: -50,
      max: 150,
      calculable: true,
      orient: 'horizontal',
      top: 10,
      left: 'center',
      type: 'continuous',
      inRange: {
        color: ['#ffffff', '#44d6ff', '#0022ff']
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params: { value: HeatmapValue }) {
        const [year, month, value] = params.value;
        const monthStr = MONTHS[month];
        return `${monthStr}. ${year}<br/>Anomaly <b style="padding-left: 15px">${mmFormatter(value)}</b>`;
      }
    },
    series: [
      {
        type: 'heatmap',
        data: heatmap.rainfall_heatmap,
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

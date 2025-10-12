'use client';

import { dateFormatter, hoursFormatter } from 'lib/formatters';

import { Chart } from '../(charts)/Chart';
import { ChartSection } from '../(charts)/ChartSection';
import { Data, HeatmapValue } from './WeatherHeatmap.server';

type SunshineHeatmapProps = {
  data: Data;
};

export function SunshineHeatmapClient({ data }: SunshineHeatmapProps) {
  const options = generateOptions(data);

  return (
    <ChartSection>
      <Chart options={options} className="aspect-[5/1] min-h-[300px]" />
    </ChartSection>
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
          name: 'monthly-sunshine-anomalies'
        }
      }
    },
    title: [
      {
        text: 'Monthly Sunshine Anomalies De Bilt',
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
      max: 120,
      calculable: true,
      orient: 'horizontal',
      top: 10,
      left: 'center',
      type: 'continuous',
      inRange: {
        color: ['#ffffff', '#ffcc6a', '#ff9662']
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params: { value: HeatmapValue }) {
        const [year, month, value] = params.value;
        const monthStr = MONTHS[month];
        return `${monthStr}. ${year}<br/>Anomaly <b style="padding-left: 15px">${hoursFormatter(value)}</b>`;
      }
    },
    series: [
      {
        type: 'heatmap',
        data: heatmap.sunshine_heatmap,
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

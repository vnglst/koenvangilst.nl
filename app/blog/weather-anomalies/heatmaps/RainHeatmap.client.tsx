'use client';

import { Chart } from 'components/Chart';
import { dateTimeFormatter } from 'lib/formatters';

import { Data, HeatmapValue } from './Heatmap.server';

type RainHeatmapProps = {
  data: Data;
};

export function RainHeatmapClient({ data }: RainHeatmapProps) {
  console.log('Heatmap data refresh:', dateTimeFormatter(data.timestamp));
  const options = generateOptions(data);

  return (
    <div className="lg:full-bleed-20 my-4 overflow-x-auto overflow-y-hidden rounded-xl border border-dashed border-gray-400 bg-white md:min-h-0 dark:border-none dark:bg-black">
      <Chart
        options={options}
        className="aspect-[5/1] min-h-[250px] w-auto lg:h-auto"
      />
    </div>
  );
}

function generateOptions(heatmap: Data) {
  const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec'
  ];

  const mmmFormat = (value: number | null) => {
    if (value === null) return '-';
    return `${Math.round(value)} mm`;
  };

  const max = Math.max(...heatmap.rainfall_heatmap.map((v) => v[2] ?? 0));
  const min = Math.min(...heatmap.rainfall_heatmap.map((v) => v[2] ?? 0));

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
        subtext: 'Source: KNMI • www.koenvangilst.nl',
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
      min,
      max,
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
        return `${monthStr}. ${year}<br/>Rainfall <b style="padding-left: 15px">${mmmFormat(
          value
        )}</b>`;
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

'use client';

import { Chart } from '../Chart';

import { dateTimeFormatter, temperatureFormatter } from './formatters';
import type { Heatmap, HeatMapValue } from './TempHeatmap.server';

type TempHeatmapProps = {
  heatmap: Heatmap;
};

export function TempHeatmapClient({ heatmap }: TempHeatmapProps) {
  console.log('TempHeatmap, refresh:', dateTimeFormatter(heatmap.timestamp));
  const options = generateOptions(heatmap);

  return (
    <Chart
      options={options}
      className="aspect-[1/9] overflow-hidden rounded-xl border border-dashed border-gray-400 bg-white md:min-h-0 dark:border-none dark:bg-black"
    />
  );
}

function generateOptions(heatmap: Heatmap) {
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

  return {
    grid: {
      top: 150,
      bottom: 50,
      left: 20,
      right: 20,
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {
          name: 'monthly-temperature-anomaly'
        }
      }
    },
    title: [
      {
        text: 'Monthly Temperature Anomaly',
        subtext:
          'Deviation from 20th century average.\nSource: KNMI • www.koenvangilst.nl',
        subtextStyle: {
          lineHeight: 18
        },
        top: 0,
        left: 0
      }
    ],
    yAxis: {
      type: 'category',
      data: heatmap.years
    },
    // graphic: [
    //   {
    //     right: 20,
    //     bottom: 20,
    //     fontSize: 10,
    //     type: 'text',
    //     style: {
    //       text: 'Data from: ' + dateFormatter(heatmap.timestamp),
    //       fill: '#9CA3AF'
    //     }
    //   }
    // ],
    xAxis: [
      {
        type: 'category',
        data: MONTHS,
        position: 'top',
        axisLabel: {
          rotate: 90
        }
      },
      {
        type: 'category',
        data: MONTHS,
        position: 'bottom',
        axisLabel: {
          rotate: 90
        }
      }
    ],
    visualMap: {
      min: -4,
      max: 4,
      calculable: true,
      orient: 'horizontal',
      top: 90,
      right: 10,
      type: 'continuous',
      inRange: {
        color: ['#74e2ff', '#ffffff', '#ff9662']
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params: { value: HeatMapValue }) {
        const [month, year, value] = params.value;
        const monthStr = MONTHS[month];
        return `${monthStr}. ${year}<br/>Anomaly <b style="padding-left: 15px">${temperatureFormatter(
          value
        )}</b>`;
      }
    },
    series: [
      {
        type: 'heatmap',
        aspectScale: 1,
        data: heatmap.data,
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

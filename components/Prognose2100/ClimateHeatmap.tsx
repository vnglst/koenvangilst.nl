'use client';

import { Chart } from '../Chart';

import { heatMapData, years } from './climate-heatmap.data';

export function ClimateHeatmap() {
  const options = generateOptions();

  return (
    <Chart
      options={options}
      className="aspect-[1/9] overflow-hidden rounded-xl border border-dashed border-gray-400 bg-white dark:border-none dark:bg-black md:min-h-0"
    />
  );
}

function generateOptions() {
  const MONTHS = [
    'Jan',
    'Feb',
    'Mrt',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Okt',
    'Nov',
    'Dec'
  ];

  return {
    grid: {
      top: 140,
      bottom: 20,
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
    title: {
      text: 'Monthly tempaturature Anomaly',
      subtext: 'Deviation from 20th century average.\nSource: KNMI.',
      subtextStyle: {
        lineHeight: 18
      },
      top: 0,
      left: 0
    },
    yAxis: {
      type: 'category',
      data: years.toReversed()
    },
    xAxis: {
      type: 'category',
      data: MONTHS
    },
    visualMap: {
      min: -4,
      max: 4,
      calculable: true,
      orient: 'horizontal',
      top: 80,
      right: 10,
      type: 'continuous',
      inRange: {
        color: ['#74e2ff', '#ffffff', '#ff9662']
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        const [month, year, value] = params.value;
        const monthStr = MONTHS[month];
        return `${monthStr}, ${year}: ${value.toFixed(2)} °C`;
      }
    },
    series: [
      {
        name: 'Temperature Data',
        type: 'heatmap',
        aspectScale: 1,
        data: heatMapData.map(([y, m, v]) => [m, y, v]).toReversed(),
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

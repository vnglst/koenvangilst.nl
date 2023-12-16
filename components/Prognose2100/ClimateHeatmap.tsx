'use client';

import { Chart } from '../Chart';

import { heatMapData, years } from './climate-heatmap.data';
import { temperatureFormatter } from './formatters';

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
      top: 140,
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
      data: years
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
      formatter: function (params: { value: [number, string, number] }) {
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
        data: heatMapData,
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
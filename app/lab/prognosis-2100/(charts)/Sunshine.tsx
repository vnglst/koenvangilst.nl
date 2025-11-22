'use client';

import { dateFormatter } from 'lib/formatters';

import { Chart } from './Chart';
import { Data } from './WeatherAnomaly.server';

// Simple color interpolation function
function lerpColor(factor: number, colors: string[]): string {
  if (factor <= 0) return colors[0];
  if (factor >= 1) return colors[colors.length - 1];

  const scaledFactor = factor * (colors.length - 1);
  const index = Math.floor(scaledFactor);
  const localFactor = scaledFactor - index;

  if (index >= colors.length - 1) return colors[colors.length - 1];

  // Simple hex color lerp between two colors
  const color1 = colors[index];
  const color2 = colors[index + 1];

  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');

  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);

  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);

  const r = Math.round(r1 + (r2 - r1) * localFactor);
  const g = Math.round(g1 + (g2 - g1) * localFactor);
  const b = Math.round(b1 + (b2 - b1) * localFactor);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

type SunshineProps = {
  data: Data;
  className: string;
};

export function SunshineClient({ data, className }: SunshineProps) {
  const options = generateOptions(data);

  return (
    <Chart
      options={options}
      className={`w-full overflow-hidden border border-dashed border-gray-400 dark:border-none ${className}`}
    />
  );
}

function generateOptions(data: Data) {
  function hoursFormatter(value: number) {
    return `${Math.round(value)} hours`;
  }

  const min = Math.min(...data.sunshine_anomalies);
  const max = Math.max(...data.sunshine_anomalies);

  return {
    grid: {
      top: 110,
      bottom: 50,
      left: 15,
      right: 15,
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {
          name: 'sunshine-anomalies'
        }
      }
    },
    title: [
      {
        text: 'Sunshine Anomalies in De Bilt',
        subtext: `Deviations from 20th century average of ${hoursFormatter(
          data.mean_sunshine
        )}.\nKNMI • www.koenvangilst.nl • ${dateFormatter(data.timestamp)}`,
        subtextStyle: {
          lineHeight: 18
        },
        top: 0,
        left: 0
      }
    ],
    tooltip: {
      valueFormatter: hoursFormatter,
      trigger: 'item',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['10 year trend'],
      bottom: 10,
      left: 'center',
      selected: {
        '10 year trend': false
      }
    },
    xAxis: {
      data: data.years,
      splitLine: {
        show: false
      }
    },
    yAxis: {
      min: -400,
      max: 700,
      type: 'value',
      splitLine: {
        show: false,
        lineStyle: {
          type: 'dashed'
        }
      },
      axisLabel: {
        formatter: (value: number) => `${Math.round(value)} h`
      }
    },
    series: [
      {
        name: 'Anomaly',
        type: 'bar',
        data: data.sunshine_anomalies.map((value) => {
          if (value === null) return;

          const factor = (value - min) / (max - min);
          const color = lerpColor(factor, ['#2196f3', '#cbf3ff', '#ffcc6a', '#ff9662']);

          return {
            value,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color
                  },
                  {
                    offset: 1,
                    color
                  }
                ]
              },
              borderRadius: value > 0 ? [15, 15, 0, 0] : [0, 0, 15, 15]
            }
          };
        }),
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: '10 year trend',
        type: 'line',
        data: data.sunshine_trend,
        smooth: true,
        lineStyle: {
          color: '#ff0000'
        },
        emphasis: {
          focus: 'series'
        }
      }
    ]
  };
}

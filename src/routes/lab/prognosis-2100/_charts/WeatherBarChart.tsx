import { dateFormatter, mmFormatter } from '#/lib/formatters';

import { Chart } from './Chart';
import { lerpColor } from './utils';
import type { Data } from './WeatherAnomaly';

type WeatherBarChartProps = {
  type: 'rain' | 'sunshine';
  data: Data;
  className: string;
};

export function WeatherBarChart({ data, type, className }: WeatherBarChartProps) {
  const options = generateOptions(data, type);

  return <Chart options={options} className={`w-full overflow-hidden ${className}`} />;
}

function sunshineFormatter(value: number) {
  return `${Math.round(value)} hours`;
}

function generateOptions(data: Data, type: 'rain' | 'sunshine') {
  const config =
    type === 'rain'
      ? {
          name: 'rainfall',
          title: 'Rainfall Anomalies in De Bilt',
          anomalies: data.rainfall_anomalies,
          trend: data.rainfall_trend,
          mean: data.mean_rainfall,
          min: -500,
          max: 600,
          colors: ['#90caf9', '#42a5f5', '#1565c0'],
          valueFormatter: mmFormatter,
          axisFormatter: mmFormatter
        }
      : {
          name: 'sunshine',
          title: 'Sunshine Anomalies in De Bilt',
          anomalies: data.sunshine_anomalies,
          trend: data.sunshine_trend,
          mean: data.mean_sunshine,
          min: -400,
          max: 700,
          colors: ['#2196f3', '#cbf3ff', '#ffcc6a', '#ff9662'],
          valueFormatter: sunshineFormatter,
          axisFormatter: (value: number) => `${Math.round(value)} h`
        };
  const min = Math.min(...config.anomalies);
  const max = Math.max(...config.anomalies);

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
          name: `${config.name}-anomalies`
        }
      }
    },
    title: [
      {
        text: config.title,
        subtext: `Deviations from 20th century average of ${config.valueFormatter(
          config.mean
        )}.\nKNMI • www.koenvangilst.nl • ${dateFormatter(data.timestamp)}`,
        subtextStyle: {
          lineHeight: 18
        },
        top: 0,
        left: 0
      }
    ],
    tooltip: {
      valueFormatter: config.valueFormatter,
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
      min: config.min,
      max: config.max,
      type: 'value',
      splitLine: {
        show: false,
        lineStyle: {
          type: 'dashed'
        }
      },
      axisLabel: {
        formatter: config.axisFormatter
      }
    },
    series: [
      {
        name: 'Anomaly',
        type: 'bar',
        data: config.anomalies.map((value) => {
          const factor = (value - min) / (max - min);
          const color = lerpColor(factor, config.colors);

          return {
            value,
            itemStyle: { color }
          };
        }),
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: '10 year trend',
        type: 'line',
        data: config.trend,
        smooth: true,
        lineStyle: {
          color: '#c05050'
        },
        emphasis: {
          focus: 'series'
        }
      }
    ]
  };
}

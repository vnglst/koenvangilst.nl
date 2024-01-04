'use client';

import { Chart, echarts } from 'components/Chart';
import { dateFormatter, temperatureFormatter } from 'lib/formatters';

import { Data } from './Anomaly.server';

type TemperatureProps = {
  data: Data;
  className: string;
};

export function TemperatureClient({ data, className }: TemperatureProps) {
  const options = generateOptions(data);

  return (
    <Chart
      options={options}
      className={`w-full overflow-hidden rounded-xl border border-dashed border-gray-400 bg-white dark:border-none dark:bg-black ${className}`}
    />
  );
}

function generateOptions(data: Data) {
  const min = Math.min(...data.temperature_anomalies);
  const max = Math.max(...data.temperature_anomalies);

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
          name: 'temperature-anomalies'
        }
      }
    },
    title: [
      {
        text: 'Temperature Anomalies in De Bilt',
        subtext: `Deviations from 20th century average of ${temperatureFormatter(
          data.mean_temperature
        )}.\nKNMI • www.koenvangilst.nl • ${dateFormatter(data.timestamp)}`,
        subtextStyle: {
          lineHeight: 18
        },
        top: 0,
        left: 0
      }
    ],
    tooltip: {
      valueFormatter: temperatureFormatter,
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
      min: -2,
      max: 3,
      type: 'value',
      splitLine: {
        show: false,
        lineStyle: {
          type: 'dashed'
        }
      },
      axisLabel: {
        formatter: (value: number) => `${Math.round(value)} °C`
      }
    },
    series: [
      {
        name: 'Anomaly',
        type: 'bar',
        data: data.temperature_anomalies.map((value) => {
          if (value === null) return;

          const factor = (value - min) / (max - min);
          const color = echarts.color.lerp(factor, [
            '#74e2ff',
            '#cbf3ff',
            '#ffcc6a',
            '#ff9662'
          ]);

          return {
            value,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color
                },
                {
                  offset: 1,
                  color
                }
              ]),
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
        data: data.temperature_trend,
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

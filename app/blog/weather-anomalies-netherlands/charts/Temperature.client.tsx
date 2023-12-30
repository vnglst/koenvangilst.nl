'use client';

import { Chart, echarts } from 'components/Chart';
import { temperatureFormatter } from 'lib/formatters';

import { Data } from './Anomaly.server';

type TemperatureProps = {
  data: Data;
};

export function TemperatureClient({ data }: TemperatureProps) {
  const options = generateOptions(data);

  return (
    <Chart
      options={options}
      className="lg:full-bleed aspect-[2/1] min-h-[40vh] w-full overflow-hidden rounded-xl border border-dashed border-gray-400 bg-white md:min-h-0 dark:border-none dark:bg-black"
    />
  );
}

function generateOptions(data: Data) {
  const min = Math.min(...data.temperature_anomalies);
  const max = Math.max(...data.temperature_anomalies);

  return {
    grid: {
      top: 110,
      bottom: 20,
      left: 15,
      right: 15,
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {
          name: 'rainfall'
        }
      }
    },
    title: [
      {
        text: 'Temperature Anomalies in De Bilt',
        subtext: `Deviations from 20th century average of ${temperatureFormatter(
          data.mean_temperature
        )}.\nSource: KNMI • www.koenvangilst.nl`,
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
    xAxis: {
      data: data.years,
      splitLine: {
        show: false
      }
    },
    yAxis: {
      min: min - 1,
      max: max + 1,
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      },
      axisLabel: {
        formatter: temperatureFormatter
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
              ])
            }
          };
        }),
        emphasis: {
          focus: 'series'
        }
      }
      // {
      //   name: '10 year trend',
      //   type: 'line',
      //   data: data.temperature_trend,
      //   smooth: true,
      //   lineStyle: {
      //     color: '#ff0000'
      //   },
      //   emphasis: {
      //     focus: 'series'
      //   }
      // }
    ]
  };
}

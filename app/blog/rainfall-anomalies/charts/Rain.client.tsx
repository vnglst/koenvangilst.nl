'use client';

import { Chart, echarts } from 'components/Chart';
import { dateTimeFormatter } from 'lib/formatters';

import { Data } from './Anomaly.server';

type RainProps = {
  data: Data;
};

export function RainClient({ data }: RainProps) {
  console.log('Data refresh:', dateTimeFormatter(data.timestamp));
  const options = generateOptions(data);

  return (
    <Chart
      options={options}
      className="lg:full-bleed my-4 aspect-video min-h-[40vh] w-full overflow-hidden rounded-xl border border-dashed border-gray-400 bg-white md:min-h-0 dark:border-none dark:bg-black"
    />
  );
}

function generateOptions(data: Data) {
  function mmFormatter(value) {
    return `${Math.round(value + data.mean_rainfall)} mm`;
  }

  const min = Math.min(...data.rainfall_anomalies);
  const max = Math.max(...data.rainfall_anomalies);

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
        text: 'Rainfall Anomalies in De Bilt',
        subtext: `Deviations from 20th century average of ${mmFormatter(
          data.mean_rainfall
        )}.\nSource: KNMI • www.koenvangilst.nl`,
        subtextStyle: {
          lineHeight: 18
        },
        top: 0,
        left: 0
      }
    ],
    tooltip: {
      valueFormatter: mmFormatter,
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
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      },
      axisLabel: {
        formatter: mmFormatter
      }
    },
    series: [
      {
        name: 'Anomaly',
        type: 'bar',
        data: data.rainfall_anomalies.map((value) => {
          if (value === null) return;

          const factor = (value - min) / (max - min);
          const color = echarts.color.lerp(factor, [
            '#cbf3ff',
            '#44d6ff',
            '#0022ff'
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
      //   data: data.rainfall_trend,
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

'use client';

import { Chart, echarts } from '../Chart';

import { dateTimeFormatter, temperatureFormatter } from './formatters';
import { Anomalies } from './TempAnomalies.server';

type TempAnomaliesProps = {
  anomalies: Anomalies;
};

export function TempAnomaliesClient({ anomalies }: TempAnomaliesProps) {
  console.log(
    'TempAnomalies, refresh:',
    dateTimeFormatter(anomalies.timestamp)
  );
  const options = generateOptions(anomalies);

  return (
    <Chart
      options={options}
      className="lg:full-bleed aspect-video min-h-[60vh] w-full overflow-hidden rounded-xl border border-dashed border-gray-400 bg-white dark:border-none dark:bg-black md:min-h-0"
    />
  );
}

function generateOptions(anomalies: Anomalies) {
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
          name: 'temperature-anomaly'
        }
      }
    },
    title: [
      {
        text: 'Temperature Anomalies',
        subtext:
          'Deviations from 20th century average of 9.3 ºC.\nSource: KNMI • www.koenvangilst.nl',
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
      data: anomalies.years,
      // .concat(
      //   new Array(2040 - 2023).fill('').map((v, idx) => `${idx + 2024}`)
      // ),
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      min: -2,
      max: 3,
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
        data: anomalies.data.map((value) => {
          if (value === null) {
            return;
          }

          return {
            value,
            itemStyle: {
              color:
                value > 0
                  ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: '#ffcc6a'
                      },
                      {
                        offset: 1,
                        color: '#ff9662'
                      }
                    ])
                  : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: '#74e2ff'
                      },
                      {
                        offset: 1,
                        color: '#cbf3ff'
                      }
                    ]),
              borderRadius: value > 0 ? [15, 15, 0, 0] : [0, 0, 15, 15]
            }
          };
        }),
        markLine: {
          lineStyle: {
            color: '#74e2ff',
            width: 2,
            type: 'dashed'
          },
          symbol: ['none', 'none'],
          animation: false,
          label: {
            fontStyle: 'italic',
            fontWeight: 'normal',
            color: '#9CA3AF'
          }
          // data: [
          //   {
          //     name: 'Best case',
          //     yAxis: 2,
          //     label: {
          //       formatter: 'Best case',
          //       position: 'insideEndTop'
          //     },
          //     tooltip: {
          //       show: true,
          //       formatter: 'KNMI best case 2100 Ld'
          //     }
          //   },
          //   {
          //     name: 'Worst case',
          //     yAxis: 5.4,
          //     label: {
          //       formatter: 'Worst case',
          //       position: 'insideEndTop'
          //     },
          //     tooltip: {
          //       show: true,
          //       formatter: 'KNMI worst case 2100 Hn'
          //     }
          //   }
          // ]
        },
        emphasis: {
          focus: 'series'
        }
      }
    ]
  };
}

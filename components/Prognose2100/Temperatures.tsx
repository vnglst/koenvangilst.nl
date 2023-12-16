'use client';

import { Chart, echarts } from '../Chart';

import { temperatureFormatter } from './formatters';
import { yearlyAnomalies, years } from './temperature.data';

export function Temperatures() {
  const options = generateOptions();

  return (
    <Chart
      options={options}
      className="lg:full-bleed aspect-video min-h-[60vh] w-full overflow-hidden rounded-xl border border-dashed border-gray-400 bg-white dark:border-none dark:bg-black md:min-h-0"
    />
  );
}

function generateOptions() {
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
          name: 'temperature-anomaly'
        }
      }
    },
    title: [
      {
        text: 'Temperature Anomalies',
        subtext:
          'Deviations from 20th century average of 9.3 ºC.\nSource: KNMI.',
        subtextStyle: {
          lineHeight: 18
        },
        top: 0,
        left: 0
      }
    ],
    graphic: {
      type: 'text',
      right: 20,
      bottom: 20,
      style: {
        text: 'www.koenvangilst.nl',
        fill: '#9CA3AF',
        fontSize: 12
      }
    },
    tooltip: {
      valueFormatter: temperatureFormatter,
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    xAxis: {
      data: years,
      // Enable this for forecasting
      // .concat(
      //   new Array(2030 - 2023).fill('').map((v, idx) => `${idx + 2024}`)
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
        show: false
      },
      axisLabel: {
        formatter: temperatureFormatter
      }
    },
    series: [
      {
        name: 'Anomaly',
        type: 'bar',
        data: yearlyAnomalies.map((value) => {
          if (value === null) {
            return {
              value: 0,
              itemStyle: {
                color: '#ffffff'
              }
            };
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
        // Enable this for forecasting
        // markLine: {
        //   lineStyle: {
        //     color: '#74e2ff',
        //     width: 1,
        //     type: 'dashed'
        //   },
        //   symbol: ['none', 'none'],
        //   animation: false,
        //   label: {
        //     fontStyle: 'italic',
        //     fontWeight: 'normal',
        //     color: '#9CA3AF'
        //   },
        //   data: [
        //     {
        //       name: 'Prognosis 2050',
        //       yAxis: 1.5,
        //       label: {
        //         formatter: '2050',
        //         position: 'insideEndTop'
        //       },
        //       tooltip: {
        //         show: true,
        //         formatter: 'KNMI Prognosis 2050'
        //       }
        //     },
        //     {
        //       name: 'Prognosis 2100',
        //       yAxis: 2.0,
        //       label: {
        //         formatter: '2100',
        //         position: 'insideEndTop'
        //       },
        //       tooltip: {
        //         show: true,
        //         formatter: 'KNMI Prognosis 2100'
        //       }
        //     }
        //   ]
        // },
        emphasis: {
          focus: 'series'
        }
      }
    ]
  };
}

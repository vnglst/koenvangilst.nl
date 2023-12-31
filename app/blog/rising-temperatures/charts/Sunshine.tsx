'use client';

import { Chart, echarts } from 'components/Chart';

import { Data } from './Anomaly.server';

type SunshineProps = {
  data: Data;
};

export function SunshineClient({ data }: SunshineProps) {
  const options = generateOptions(data);

  return (
    <Chart
      options={options}
      className="lg:full-bleed my-4 aspect-[2/1] min-h-[60vh] w-full overflow-hidden rounded-xl border border-dashed border-gray-400 bg-white md:min-h-0 dark:border-none dark:bg-black"
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
        )}.\nSource: KNMI • www.koenvangilst.nl`,
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
        show: true,
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

'use client';

import { Chart, echarts } from '../Chart';

import { historicDifferences, historicYears } from './temperature.data';

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
  const barName = 'Afwijking';
  const yAxisUnit = '°C';

  return {
    grid: {
      top: 110,
      bottom: 15,
      left: 15,
      right: 25
    },
    title: {
      text: 'Temperatuurafwijking',
      subtext:
        'Afwijking tov. gemiddelde van 9.3 ºC in de vorige eeuw.\nBron: KNMI.',
      subtextStyle: {
        lineHeight: 18
      },
      top: 10,
      left: 10
    },
    tooltip: {
      valueFormatter: (value) => `${value.toFixed(2)} ${yAxisUnit}`,
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    xAxis: {
      data: historicYears,
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
        formatter: `{value} ${yAxisUnit}`
      }
    },
    series: [
      {
        name: barName,
        type: 'bar',
        data: historicDifferences.map((value, idx) => ({
          value,
          itemStyle: {
            color:
              idx > 121
                ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#94a3b8'
                    },
                    {
                      offset: 1,
                      color: '#f1f5f9'
                    }
                  ])
                : value > 0
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
        })),
        animationDelay: (idx) => {
          return idx * 10;
        },
        emphasis: {
          focus: 'series'
        }
      }
    ]
  };
}

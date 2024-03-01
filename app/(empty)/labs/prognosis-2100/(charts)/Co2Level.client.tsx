'use client';

import { Chart, echarts } from 'components/Chart';
import { colors } from 'components/Chart/themes/colors';
import { dateFormatter } from 'lib/formatters';

import { usePrognosisStore } from '../(store)/prognosis';

import { DataType } from './Co2Level';

type SealevelProps = {
  data: DataType;
  className: string;
};

export function Co2LevelClient({ data, className }: SealevelProps) {
  const store = usePrognosisStore();
  const options = generateOptions(data, store.showPrognosis);

  return (
    <Chart
      options={options}
      className={`w-full overflow-hidden rounded-xl border border-dashed border-gray-400 bg-white dark:border-none dark:bg-black ${className}`}
    />
  );
}

function generateOptions(data: DataType, showPrognosis: boolean) {
  const prognosisMarklines = [
    {
      name: 'Worst Case',
      type: 'line',
      markLine: {
        symbol: 'none',
        lineStyle: {
          color: colors.red
        },
        data: [
          [
            {
              xAxis: '2023',
              yAxis: data.last_co2_level
            },
            { xAxis: '2100', yAxis: data.worst_case }
          ]
        ]
      },
      itemStyle: {
        color: colors.red
      }
    },
    {
      name: 'Best Case',
      type: 'line',
      markLine: {
        symbol: 'none',
        lineStyle: {
          color: colors.limeGreen
        },
        data: [
          [
            {
              xAxis: '2023',
              yAxis: data.last_co2_level
            },
            { xAxis: '2100', yAxis: data.best_case }
          ]
        ]
      },
      itemStyle: {
        color: colors.limeGreen
      }
    }
  ];

  return {
    grid: {
      top: 120,
      bottom: 50,
      left: 15,
      right: 15
    },
    title: {
      text: 'Global CO2 level',
      subtext: `In ppm measured at Mauna Loa.\nGlobal Monitoring Laboratory • www.koenvangilst.nl • ${dateFormatter(
        data.timestamp
      )}`,
      subtextStyle: {
        lineHeight: 18
      },
      top: 10,
      left: 10
    },
    tooltip: {
      valueFormatter: (value: number) => `${value.toFixed(3)} m`,
      trigger: 'item',
      axisPointer: {
        type: 'cross'
      }
    },
    ...(showPrognosis
      ? {
          legend: {
            data: ['CO2 levels', 'Worst Case', 'Best Case'],
            bottom: 10,
            left: 'center',
            selected: showPrognosis
              ? {
                  'CO2 levels': true,
                  'Worst Case': true,
                  'Best Case': true
                }
              : {
                  'CO2 levels': true
                }
          }
        }
      : {}),
    xAxis: {
      data: showPrognosis ? data.forecast_years : data.years,
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false
      },
      min: 0,
      max: showPrognosis ? 1000 : 500
    },
    series: [
      {
        name: 'CO2 levels',
        type: 'line',
        smooth: true,
        data: data.co2_levels,
        emphasis: {
          focus: 'series'
        },
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#74e2ff'
          },
          {
            offset: 1,
            color: '#cbf3ff'
          }
        ]),
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#19c9ff'
            },
            {
              offset: 1,
              color: '#74e2ff'
            }
          ])
        }
      },
      ...(showPrognosis ? prognosisMarklines : [])
    ]
  };
}

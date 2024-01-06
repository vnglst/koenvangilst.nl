'use client';

import { Chart, echarts } from 'components/Chart';
import { dateFormatter } from 'lib/formatters';

import { usePrognosisStore } from '../(store)/prognosis';

import { DataType } from './Sealevel.server';

type SealevelProps = {
  data: DataType;
  className: string;
};

export function SealevelClient({ data, className }: SealevelProps) {
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
        data: [
          [
            {
              xAxis: '2023',
              yAxis: data.last_sealevel
            },
            { xAxis: '2100', yAxis: data.worst_case }
          ]
        ]
      }
    },
    {
      name: 'Best Case',
      type: 'line',
      markLine: {
        symbol: 'none',
        data: [
          [
            {
              xAxis: '2023',
              yAxis: data.last_sealevel
            },
            { xAxis: '2100', yAxis: data.best_case }
          ]
        ]
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
      text: 'Sea Level Rise',
      subtext: `Global rise in metres, with 1993 as zero point.\nNASA • www.koenvangilst.nl • ${dateFormatter(
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
            data: ['Sea Level', 'Worst Case', 'Best Case'],
            bottom: 10,
            left: 'center',
            selected: showPrognosis
              ? {
                  'Sea Level': true,
                  'Worst Case': true,
                  'Best Case': true
                }
              : {
                  'Sea Level': true
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
      max: showPrognosis ? 0.8 : 0.15
    },
    series: [
      {
        name: 'Sea Level',
        type: 'line',
        smooth: true,
        data: data.sealevels,
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

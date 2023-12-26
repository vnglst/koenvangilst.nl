'use client';

import { View } from 'services/types';

import { Chart, echarts } from './Chart';

type VisitsVisualProps = {
  visits: View[];
};

export function VisitsVisual({ visits }: VisitsVisualProps) {
  const options = generateOptions(visits);

  return (
    <Chart
      options={options}
      className="aspect-video min-h-[80vh] w-full overflow-hidden rounded-xl border border-dashed border-gray-400 bg-white md:min-h-0 dark:bg-[#111827]"
    />
  );
}

function generateOptions(visits: View[]) {
  const data = visits.map((visit) => {
    return [visit.created_at, visit.count];
  });

  return {
    grid: {
      top: 80,
      bottom: 50,
      left: 15,
      right: 15,
      containLabel: true
    },
    title: {
      text: 'Visits Past 365 Days'
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        let tooltipContent = '';

        params.forEach((item) => {
          const date = new Date(item.data[0]).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });

          const visits = new Intl.NumberFormat('en-US').format(item.data[1]);
          tooltipContent += `
            <div class="flex flex-col p-3 gap-1">
              <div>${date}</div>
              <div class="flex flex-row gap-2 justify-between items-center">
                Visits
                <div class="font-bold">
                  ${visits}
                </div>
              </div>
            </div>`;
        });

        return tooltipContent;
      },
      padding: 0,
      margin: 0,
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false
      },
      min: 0
    },
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 90,
        end: 100
      },
      {
        type: 'inside',
        realtime: true,
        start: 90,
        end: 100
      }
    ],
    series: [
      {
        name: 'Visits',
        type: 'bar',
        data: data,
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          borderRadius: [15, 15, 0, 0]
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
        ])
      }
    ]
  };
}

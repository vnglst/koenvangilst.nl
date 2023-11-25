'use client';

import { useEffect, useRef } from 'react';
import { BarChart } from 'echarts/charts';
import {
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

import { View } from 'services/types';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  BarChart,
  CanvasRenderer,
  GraphicComponent
]);

export function VisitsVisual({ visits }: { visits: View[] }) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    chart.setOption(generateOptions(visits));

    function handleResize() {
      chart.resize();
    }

    window.addEventListener('resize', handleResize);
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    mediaQuery.addEventListener('change', handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, [chartRef, visits]);

  return (
    <div
      ref={chartRef}
      className="aspect-video min-h-[80vh] md:min-h-0 w-full rounded-xl overflow-hidden bg-[#111827]"
    />
  );
}

function generateOptions(visits: View[]) {
  const data = visits.map((visit) => {
    return [visit.created_at, visit.count];
  });

  return {
    title: {
      padding: 20,
      text: 'Visits Past 365 Days',
      textStyle: {
        color: '#fff',
        fontFamily: 'var(--font-montserrat), sans-serif'
      },
      left: 'center'
    },
    bar: {
      itemStyle: {
        borderRadius: [15, 15, 0, 0]
      }
    },
    backgroundColor: new echarts.graphic.RadialGradient(0, 0, 8, [
      {
        offset: 0,
        color: '#111827'
      },
      {
        offset: 1,
        color: '#204051'
      }
    ]),
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
    grid: {
      left: '3%',
      right: '4%',
      bottom: '13%',
      containLabel: true
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

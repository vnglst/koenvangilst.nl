import { Chart } from './Chart';
import { createPrognosisMarklines } from './utils';

import { dateFormatter } from '#/lib/formatters';

import { usePrognosisStore } from '../_store/prognosis';
import type { DataType } from './Co2Level';

type Co2LevelProps = {
  data: DataType;
  className: string;
};

export function Co2LevelClient({ data, className }: Co2LevelProps) {
  const { showPrognosis } = usePrognosisStore();
  const options = generateOptions(data, showPrognosis);

  return (
    <Chart
      options={options}
      className={`w-full overflow-hidden border border-dashed border-gray-400 dark:border-none ${className}`}
    />
  );
}

function generateOptions(data: DataType, showPrognosis: boolean) {
  const prognosisMarklines = createPrognosisMarklines({
    lastValue: data.last_co2_level,
    worstCase: data.worst_case,
    bestCase: data.best_case
  });

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
      valueFormatter: (value: number) => `${value.toFixed(1)} ppm`,
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
            selected: {
              'CO2 levels': true,
              'Worst Case': true,
              'Best Case': true
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
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#2196f3'
            },
            {
              offset: 1,
              color: '#cbf3ff'
            }
          ]
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#19c9ff'
              },
              {
                offset: 1,
                color: '#2196f3'
              }
            ]
          }
        }
      },
      ...(showPrognosis ? prognosisMarklines : [])
    ]
  };
}

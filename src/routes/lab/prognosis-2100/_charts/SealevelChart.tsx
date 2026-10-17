import { dateFormatter } from '#/lib/formatters';

import { usePrognosisStore } from '../_store/prognosis';
import { Chart } from './Chart';
import { createPrognosisMarklines } from './utils';
import type { DataType } from './Sealevel';

type SealevelProps = {
  data: DataType;
  className: string;
};

export function SealevelClient({ data, className }: SealevelProps) {
  const { showPrognosis } = usePrognosisStore();
  const options = generateOptions(data, showPrognosis);

  return <Chart options={options} className={`w-full overflow-hidden ${className}`} />;
}

function generateOptions(data: DataType, showPrognosis: boolean) {
  const prognosisMarklines = createPrognosisMarklines({
    lastValue: data.last_sealevel,
    worstCase: data.worst_case,
    bestCase: data.best_case
  });

  return {
    grid: {
      top: 120,
      bottom: 50,
      left: 15,
      right: 15,
      containLabel: true
    },
    title: {
      text: 'Sea Level Rise',
      subtext: `Global rise in metres, with 1993 as zero point.\nNASA • www.koenvangilst.nl • ${dateFormatter(
        data.timestamp
      )}`,
      subtextStyle: {
        lineHeight: 18
      },
      top: 0,
      left: 0
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
            selected: {
              'Sea Level': true,
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
        lineStyle: { width: 2 },
        areaStyle: { opacity: 0.12 }
      },
      ...(showPrognosis ? prognosisMarklines : [])
    ]
  };
}

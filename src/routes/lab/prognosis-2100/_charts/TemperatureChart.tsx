import { dateFormatter, temperatureFormatter } from '#/lib/formatters';

import { usePrognosisStore } from '../_store/prognosis';
import { Chart } from './Chart';
import { createPrognosisMarklines, lerpColor } from './utils';
import type { Data } from './WeatherAnomaly';

type TemperatureProps = {
  data: Data;
  className: string;
};

export function TemperatureClient({ data, className }: TemperatureProps) {
  const { showPrognosis } = usePrognosisStore();
  const options = generateOptions(data, showPrognosis);

  return (
    <Chart
      options={options}
      className={`w-full overflow-hidden border border-dashed border-gray-400 dark:border-none ${className}`}
    />
  );
}

function generateOptions(data: Data, showPrognosis: boolean) {
  const prognosisMarklines = createPrognosisMarklines({
    lastValue: data.last_temperature_trend,
    worstCase: data.temperature_worst_case,
    bestCase: data.temperature_best_case
  });

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
          name: 'temperature-anomalies'
        }
      }
    },
    title: [
      {
        text: 'Temperature Anomalies in De Bilt',
        subtext: `Deviations from 20th century average of ${temperatureFormatter(
          data.mean_temperature
        )}.\nKNMI • www.koenvangilst.nl • ${dateFormatter(data.timestamp)}`,
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
    legend: {
      data: showPrognosis ? ['10 year trend', 'Worst Case', 'Best Case'] : ['10 year trend'],
      bottom: 10,
      left: 'center',
      selected: showPrognosis
        ? {
            Anomaly: false,
            '10 year trend': true,
            'Worst Case': true,
            'Best Case': true
          }
        : {
            '10 year trend': false
          }
    },
    xAxis: {
      data: showPrognosis ? data.forecast_years : data.years,
      splitLine: {
        show: false
      }
    },
    yAxis: {
      min: -2,
      max: showPrognosis ? 8 : 3,
      type: 'value',
      splitLine: {
        show: false,
        lineStyle: {
          type: 'dashed'
        }
      },
      axisLabel: {
        formatter: (value: number) => `${Math.round(value)} °C`
      }
    },
    series: [
      {
        name: 'Anomaly',
        type: 'bar',
        data: data.temperature_anomalies.map((value) => {
          const factor =
            (value - data.min_temperature_anomaly) / (data.max_temperature_anomaly - data.min_temperature_anomaly);
          const color = lerpColor(factor, ['#2196f3', '#cbf3ff', '#ffcc6a', '#ff9662']);

          return {
            value,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color
                  },
                  {
                    offset: 1,
                    color
                  }
                ]
              },
              borderRadius: value > 0 ? [15, 15, 0, 0] : [0, 0, 15, 15]
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
        data: data.temperature_trend,
        smooth: true,
        emphasis: {
          focus: 'series'
        }
      },
      ...(showPrognosis ? prognosisMarklines : [])
    ]
  };
}

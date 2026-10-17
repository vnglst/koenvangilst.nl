import { dateFormatter, mmFormatter } from '#/lib/formatters';

import { Chart } from './Chart';
import { lerpColor } from './utils';
import type { Data } from './WeatherAnomaly';

type RainProps = {
  data: Data;
  className: string;
};

export function RainClient({ data, className }: RainProps) {
  const options = generateOptions(data);

  return <Chart options={options} className={`w-full overflow-hidden ${className}`} />;
}

function generateOptions(data: Data) {
  const min = Math.min(...data.rainfall_anomalies);
  const max = Math.max(...data.rainfall_anomalies);

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
          name: 'rainfall-anomalies'
        }
      }
    },
    title: [
      {
        text: 'Rainfall Anomalies in De Bilt',
        subtext: `Deviations from 20th century average of ${mmFormatter(
          data.mean_rainfall
        )}.\nKNMI • www.koenvangilst.nl • ${dateFormatter(data.timestamp)}`,
        subtextStyle: {
          lineHeight: 18
        },
        top: 0,
        left: 0
      }
    ],
    tooltip: {
      valueFormatter: mmFormatter,
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
      min: -500,
      max: 600,
      type: 'value',
      splitLine: {
        show: false,
        lineStyle: {
          type: 'dashed'
        }
      },
      axisLabel: {
        formatter: mmFormatter
      }
    },
    series: [
      {
        name: 'Anomaly',
        type: 'bar',
        data: data.rainfall_anomalies.map((value) => {
          const factor = (value - min) / (max - min);
          const color = lerpColor(factor, ['#90caf9', '#42a5f5', '#1565c0']);

          return {
            value,
            itemStyle: { color }
          };
        }),
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: '10 year trend',
        type: 'line',
        data: data.rainfall_trend,
        smooth: true,
        lineStyle: {
          color: '#c05050'
        },
        emphasis: {
          focus: 'series'
        }
      }
    ]
  };
}

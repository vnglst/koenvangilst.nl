import { colors } from './themes/colors';

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

export function lerpColor(factor: number, colorPalette: string[]): string {
  if (factor <= 0) return colorPalette[0];
  if (factor >= 1) return colorPalette[colorPalette.length - 1];

  const scaledFactor = factor * (colorPalette.length - 1);
  const index = Math.floor(scaledFactor);
  const localFactor = scaledFactor - index;

  if (index >= colorPalette.length - 1) return colorPalette[colorPalette.length - 1];

  const color1 = colorPalette[index];
  const color2 = colorPalette[index + 1];

  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');

  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);

  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);

  const r = Math.round(r1 + (r2 - r1) * localFactor);
  const g = Math.round(g1 + (g2 - g1) * localFactor);
  const b = Math.round(b1 + (b2 - b1) * localFactor);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

type PrognosisMarklineConfig = {
  lastValue: number;
  worstCase: number;
  bestCase: number;
  startYear?: string;
  endYear?: string;
};

export function createPrognosisMarklines(config: PrognosisMarklineConfig) {
  const { lastValue, worstCase, bestCase, startYear = '2023', endYear = '2100' } = config;

  return [
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
              xAxis: startYear,
              yAxis: lastValue
            },
            { xAxis: endYear, yAxis: worstCase }
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
              xAxis: startYear,
              yAxis: lastValue
            },
            { xAxis: endYear, yAxis: bestCase }
          ]
        ]
      },
      itemStyle: {
        color: colors.limeGreen
      }
    }
  ];
}

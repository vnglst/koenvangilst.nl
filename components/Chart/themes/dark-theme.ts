import { echarts } from '../Chart';

import { colors } from './colors';

export const darkTheme = {
  darkMode: true,
  color: Object.values(colors),
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
  textStyle: {
    // Setting fontFamily doesn't work for Canvas renderer.
    // fontFamily: 'var(--font-inter), sans-serif',
    color: '#cbd5e1',
    fontSize: 12
  },
  title: {
    padding: 20,
    left: 'left',
    textStyle: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'normal'
      // Setting fontFamily doesn't work for Canvas renderer.
      // fontFamily: 'var(--font-inter), sans-serif'
    },
    subtextStyle: {
      color: '#94a3b8',
      fontSize: 12
    },
    bottom: 200
  },
  bar: {
    itemStyle: {
      borderRadius: [15, 15, 0, 0]
    }
  },
  grid: {
    top: '20%',
    left: '3%',
    right: '4%',
    bottom: '13%',
    containLabel: true
  },
  visualMap: {
    textStyle: {
      color: '#fff'
    }
  },
  toolbox: {
    iconStyle: {
      borderColor: '#fff'
    }
  },
  legend: {
    textStyle: {
      color: '#fff'
    }
  }
};

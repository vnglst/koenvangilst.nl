import { echarts } from '../Chart';

export const darkTheme = {
  darkMode: true,
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
    fontFamily: "'Lato', sans-serif",
    color: '#cbd5e1'
  },
  title: {
    textStyle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#cbd5e1'
    },
    subtextStyle: {
      color: '#94a3b8'
    },
    bottom: 200
  },
  bar: {
    itemStyle: {
      borderRadius: [15, 15, 0, 0]
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '13%',
    containLabel: true
  }
};

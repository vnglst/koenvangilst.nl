import { colors } from './colors';

export const darkTheme = {
  darkMode: true,
  color: Object.values(colors),
  backgroundColor: '#111110',
  textStyle: {
    // Setting fontFamily doesn't work for Canvas renderer.
    // fontFamily: 'var(--font-sans), sans-serif',
    color: '#e9e7e0',
    fontSize: 12
  },
  title: {
    padding: 20,
    left: 'left',
    textStyle: {
      color: '#e9e7e0',
      fontSize: 16,
      fontWeight: 'normal'
      // Setting fontFamily doesn't work for Canvas renderer.
      // fontFamily: 'var(--font-sans), sans-serif'
    },
    subtextStyle: {
      color: '#a5a59b',
      fontSize: 12
    },
    bottom: 200
  },
  bar: {
    itemStyle: {
      borderRadius: 0
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
      color: '#e9e7e0'
    }
  },
  toolbox: {
    iconStyle: {
      borderColor: '#e9e7e0'
    }
  },
  legend: {
    textStyle: {
      color: '#e9e7e0'
    }
  }
};

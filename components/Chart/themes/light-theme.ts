import { colors } from './colors';

export const lightTheme = {
  darkMode: false,
  color: Object.values(colors),
  backgroundColor: 'white',
  textStyle: {
    fontSize: 12
    // Setting fontFamily doesn't work for Canvas renderer.
    // fontFamily: 'var(--font-inter), sans-serif',
  },
  title: {
    padding: 20,
    left: 'left',
    textStyle: {
      color: '#000',
      fontSize: 16,
      fontWeight: 'normal'
      // Setting fontFamily doesn't work for Canvas renderer.
      // fontFamily: 'var(--font-inter), sans-serif'
    },
    subtextStyle: {
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
  toolbox: {
    iconStyle: {
      borderColor: '#000'
    }
  },
  legend: {
    textStyle: {
      color: '#000'
    }
  }
};

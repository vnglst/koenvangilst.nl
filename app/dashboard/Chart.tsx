'use client';

import { memo, useEffect, useRef, useState } from 'react';
import type * as echartsType from 'echarts/core';
import type { ECBasicOption } from 'echarts/types/dist/shared';

import { Theme, useTheme } from 'components/theme/theme.store';

const darkTheme = {
  darkMode: true,
  color: ['#2196f3', '#42a5f5', '#64b5f6', '#1976d2', '#1565c0'],
  backgroundColor: 'transparent',
  textStyle: {
    color: '#cbd5e1',
    fontSize: 12
  },
  title: {
    textStyle: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'normal'
    },
    subtextStyle: {
      color: '#94a3b8',
      fontSize: 12
    }
  },
  grid: {
    top: '15%',
    left: '3%',
    right: '4%',
    bottom: '10%',
    containLabel: true
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

const lightTheme = {
  darkMode: false,
  color: ['#2196f3', '#42a5f5', '#64b5f6', '#1976d2', '#1565c0'],
  backgroundColor: 'transparent',
  textStyle: {
    fontSize: 12
  },
  title: {
    textStyle: {
      color: '#000',
      fontSize: 16,
      fontWeight: 'normal'
    },
    subtextStyle: {
      fontSize: 12
    }
  },
  grid: {
    top: '15%',
    left: '3%',
    right: '4%',
    bottom: '10%',
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

const DEFAULT_OPTIONS: ECBasicOption = {
  toolbox: {
    feature: {
      saveAsImage: {
        title: 'Save',
        show: true
      }
    },
    right: 15,
    top: 15
  }
};

type ChartProps = {
  options: ECBasicOption;
  className: string;
};

const ChartComponent = ({ options, className }: ChartProps) => {
  const mode = useTheme((state) => state.theme);
  const chartRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chartRef.current) return;

    let chart: ReturnType<typeof echartsType.init> | null = null;

    const loadChart = async () => {
      const [
        echarts,
        { BarChart, LineChart },
        {
          GridComponent,
          LegendComponent,
          TitleComponent,
          ToolboxComponent,
          TooltipComponent,
          DataZoomComponent
        },
        { CanvasRenderer }
      ] = await Promise.all([
        import('echarts/core'),
        import('echarts/charts'),
        import('echarts/components'),
        import('echarts/renderers')
      ]);

      echarts.use([
        BarChart,
        LineChart,
        LegendComponent,
        GridComponent,
        CanvasRenderer,
        TitleComponent,
        ToolboxComponent,
        TooltipComponent,
        DataZoomComponent
      ]);

      echarts.registerTheme(Theme.Light, lightTheme);
      echarts.registerTheme(Theme.Dark, darkTheme);

      if (!chartRef.current) return;

      chart = echarts.init(chartRef.current, mode, { renderer: 'canvas' });

      // Merge options
      const mergedOptions = {
        ...DEFAULT_OPTIONS,
        ...options
      };

      chart.setOption(mergedOptions);
      setIsLoading(false);

      const handleResize = () => chart?.resize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    };

    const cleanup = loadChart();

    return () => {
      cleanup.then((cleanupFn) => cleanupFn?.());
      chart?.dispose();
    };
  }, [mode, options]);

  return (
    <div className="relative">
      {isLoading && (
        <div className={`${className} flex items-center justify-center bg-gray-100 dark:bg-gray-900`}>
          <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>
        </div>
      )}
      <div ref={chartRef} className={className} style={{ opacity: isLoading ? 0 : 1 }} />
    </div>
  );
};

export const Chart = memo(ChartComponent);

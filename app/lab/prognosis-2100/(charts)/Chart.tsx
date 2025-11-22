'use client';

import { memo, useEffect, useRef, useState } from 'react';
import type * as echartsType from 'echarts/core';
// Type imports don't increase bundle size
import type { ECBasicOption } from 'echarts/types/dist/shared';

import { Theme, useTheme } from 'components/theme/theme.store';
import { merge } from 'lib/merge';

import { darkTheme } from './themes/dark-theme';
import { lightTheme } from './themes/light-theme';

type ChartProps = {
  options: ECBasicOption;
  className: string;
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

const ChartComponent = ({ options, className }: ChartProps) => {
  const mode = useTheme((state) => state.theme);
  const chartRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chartRef.current) return;

    let chart: ReturnType<typeof echartsType.init> | null = null;

    const loadChart = async () => {
      // Dynamic imports - echarts will only be loaded when this component renders
      const [
        echarts,
        { BarChart, HeatmapChart, LineChart },
        {
          DataZoomComponent,
          GraphicComponent,
          GridComponent,
          LegendComponent,
          MarkLineComponent,
          TitleComponent,
          ToolboxComponent,
          TooltipComponent,
          VisualMapComponent
        },
        { CanvasRenderer }
      ] = await Promise.all([
        import('echarts/core'),
        import('echarts/charts'),
        import('echarts/components'),
        import('echarts/renderers')
      ]);

      // Register required components
      echarts.use([
        BarChart,
        LineChart,
        LegendComponent,
        DataZoomComponent,
        GraphicComponent,
        GridComponent,
        HeatmapChart,
        MarkLineComponent,
        CanvasRenderer,
        TitleComponent,
        ToolboxComponent,
        TooltipComponent,
        VisualMapComponent
      ]);

      echarts.registerTheme(Theme.Light, lightTheme);
      echarts.registerTheme(Theme.Dark, darkTheme);

      if (!chartRef.current) return;

      chart = echarts.init(chartRef.current, mode, { renderer: 'canvas' });
      chart.setOption(merge(options, DEFAULT_OPTIONS));
      setIsLoading(false);

      const handleResize = () => chart?.resize();
      window.addEventListener('resize', handleResize);
      const mediaQuery = window.matchMedia('(max-width: 768px)');
      mediaQuery.addEventListener('change', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        mediaQuery.removeEventListener('change', handleResize);
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
        <div className={`${className} flex items-center justify-center bg-gray-100 dark:bg-gray-800`}>
          <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>
        </div>
      )}
      <div ref={chartRef} className={className} style={{ opacity: isLoading ? 0 : 1 }} />
    </div>
  );
};

export const Chart = memo(ChartComponent);

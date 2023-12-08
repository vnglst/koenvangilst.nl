'use client';

import { useEffect, useRef } from 'react';
import { BarChart } from 'echarts/charts';
import {
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { ECBasicOption } from 'echarts/types/dist/shared';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  BarChart,
  CanvasRenderer,
  GraphicComponent
]);

export { echarts };

import { darkTheme } from './themes/dark-theme';
import { lightTheme } from './themes/light-theme';

type ChartProps = {
  options: ECBasicOption;
  className: string;
};

export function Chart({ options, className }: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    echarts.registerTheme('light', lightTheme);
    echarts.registerTheme('dark', darkTheme);

    const chart = echarts.init(chartRef.current, 'dark');
    chart.setOption(options);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    mediaQuery.addEventListener('change', handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, [chartRef, options]);

  return <div ref={chartRef} className={className} />;
}

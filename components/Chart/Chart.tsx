'use client';

import { useEffect, useRef } from 'react';
import { BarChart, HeatmapChart } from 'echarts/charts';
import {
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  MarkLineComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { ECBasicOption } from 'echarts/types/dist/shared';
import merge from 'lodash/merge';

echarts.use([
  BarChart,
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

export { echarts };

import { Theme, useTheme } from 'components/Theme';

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

export function Chart({ options, className }: ChartProps) {
  const mode = useTheme((state) => state.theme);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    echarts.registerTheme(Theme.Light, lightTheme);
    echarts.registerTheme(Theme.Dark, darkTheme);

    const chart = echarts.init(chartRef.current, mode, { renderer: 'canvas' });
    chart.setOption(merge(options, DEFAULT_OPTIONS));

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    mediaQuery.addEventListener('change', handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, [chartRef, mode, options]);

  return <div ref={chartRef} className={className} />;
}

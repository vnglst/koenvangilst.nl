import { LoadingState } from '#/components/content/LoadingState';
import { memo, useEffect, useRef, useState } from 'react';
import type * as echartsType from 'echarts/core';
// Type imports don't increase bundle size
import type { ECBasicOption } from 'echarts/types/dist/shared';

import { useTheme } from '#/components/theme/theme.store';
import { merge } from '#/lib/merge';

import { getChartTheme } from './themes/site-theme';

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
    right: 0,
    top: 0
  }
};

const ChartComponent = ({ options, className }: ChartProps) => {
  const mode = useTheme((state) => state.theme);
  const chartRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chartRef.current) return;

    let chart: ReturnType<typeof echartsType.init> | null = null;
    let cleanupChart: (() => void) | undefined;
    let cancelled = false;

    const loadChart = async () => {
      // Keep the async boundary while allowing unused ECharts features to be removed.
      const { createChart } = await import('./create-chart');

      if (!chartRef.current) return;
      const fontFamily = getComputedStyle(chartRef.current).fontFamily;
      await Promise.all([document.fonts.load(`600 16px ${fontFamily}`), document.fonts.load(`400 12px ${fontFamily}`)]);
      await document.fonts.ready;
      if (cancelled) return;

      chart = createChart(chartRef.current, getChartTheme(chartRef.current));
      chart.setOption(merge(options, DEFAULT_OPTIONS));
      setIsLoading(false);

      const observer = new ResizeObserver(() => {
        if (!chart || !chartRef.current) return;
        chart.resize();
        const width = Math.max(180, chartRef.current.clientWidth - 44);
        chart.setOption({ title: { textStyle: { width }, subtextStyle: { width } } });
      });
      observer.observe(chartRef.current);
      cleanupChart = () => observer.disconnect();
    };

    void loadChart().catch((error) => console.error('Failed to initialize chart:', error));

    return () => {
      cancelled = true;
      cleanupChart?.();
      chart?.dispose();
    };
  }, [mode, options]);

  return (
    <div className={`data-chart relative ${className}`}>
      {isLoading && (
        <LoadingState className="chart-loading absolute inset-0 bg-[var(--surface)]">Loading chart...</LoadingState>
      )}
      <div ref={chartRef} className="h-full w-full" style={{ opacity: isLoading ? 0 : 1 }} />
    </div>
  );
};

export const Chart = memo(ChartComponent);

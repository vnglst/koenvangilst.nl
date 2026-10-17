import { init, use as registerChartFeatures } from 'echarts/core';
import { BarChart, HeatmapChart, LineChart } from 'echarts/charts';
import {
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Static named imports inside this lazy module let the bundler remove unused
// chart types, components and the SVG renderer. Register once per module load.
registerChartFeatures([
  BarChart,
  HeatmapChart,
  LineChart,
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
  CanvasRenderer
]);

export function createChart(element: HTMLDivElement, theme: Parameters<typeof init>[1]) {
  return init(element, theme, { renderer: 'canvas' });
}

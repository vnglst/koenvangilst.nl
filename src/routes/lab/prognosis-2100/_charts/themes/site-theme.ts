export function getChartTheme(element: HTMLElement) {
  const style = getComputedStyle(element);
  const token = (name: string) => style.getPropertyValue(`--${name}`).trim();
  const ink = token('ink');
  const muted = token('muted');
  const line = token('line');
  const fontFamily = style.fontFamily;
  const width = Math.max(180, element.clientWidth - 44);
  const axis = {
    axisLine: { lineStyle: { color: line } },
    axisTick: { lineStyle: { color: line } },
    axisLabel: { color: muted, fontFamily, fontSize: 12 },
    splitLine: { lineStyle: { color: line } }
  };

  return {
    darkMode: document.documentElement.classList.contains('dark'),
    backgroundColor: token('page'),
    color: [token('accent'), '#c05050', '#7eb00a', '#f5994e'],
    textStyle: { color: ink, fontFamily, fontSize: 13 },
    title: {
      padding: 0,
      textStyle: { color: ink, fontFamily, fontSize: 16, fontWeight: 600, lineHeight: 22, width, overflow: 'break' },
      subtextStyle: { color: muted, fontFamily, fontSize: 12, lineHeight: 18, width, overflow: 'break' }
    },
    categoryAxis: axis,
    valueAxis: axis,
    legend: { textStyle: { color: muted, fontFamily, fontSize: 12 } },
    visualMap: { textStyle: { color: muted, fontFamily, fontSize: 12 } },
    toolbox: { iconStyle: { borderColor: muted }, emphasis: { iconStyle: { borderColor: token('accent') } } },
    tooltip: {
      confine: true,
      backgroundColor: token('surface'),
      borderColor: line,
      borderWidth: 1,
      textStyle: { color: ink, fontFamily, fontSize: 13 },
      extraCssText: 'box-shadow: none;'
    },
    axisPointer: {
      lineStyle: { color: muted },
      label: { backgroundColor: token('surface'), color: ink, borderColor: line, borderWidth: 1, fontFamily }
    }
  };
}

import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import path from 'node:path';

// Fixed KNMI-shaped samples keep chart behavior independent of upstream updates.
test.beforeEach(async ({ page }) => {
  for (const filename of [
    'yearly-weather-data.json',
    'monthly-weather-data.json',
    'co2_levels.json',
    'sealevels.json'
  ]) {
    await page.route(`https://raw.githubusercontent.com/vnglst/dutch-climate-data/main/data/${filename}`, (route) =>
      route.fulfill({ path: path.resolve('e2e/fixtures/climate', filename), contentType: 'application/json' })
    );
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

async function expectDrawnCharts(charts: Locator, count: number) {
  await expect(charts).toHaveCount(count);
  for (const chart of await charts.all()) {
    await chart.scrollIntoViewIfNeeded();
    await expect(chart).toBeVisible();
    await expect
      .poll(() =>
        chart.locator('canvas').evaluateAll((canvases) =>
          canvases.some((canvas) => {
            const { data } = (canvas as HTMLCanvasElement)
              .getContext('2d')!
              .getImageData(0, 0, canvas.width, canvas.height);
            return data.some((value, index) => index % 4 === 3 && value > 0);
          })
        )
      )
      .toBe(true);
  }
}

async function stableChartImage(chart: Locator) {
  await chart.page().mouse.move(0, 0);
  let previous: string[] = [];
  let current: string[] = [];
  await expect
    .poll(async () => {
      previous = current;
      current = await chart.locator('canvas').evaluateAll((canvases) => canvases.map((canvas) => canvas.toDataURL()));
      return JSON.stringify(current) === JSON.stringify(previous);
    })
    .toBe(true);
  return current;
}

for (const width of [390, 1440]) {
  test(`Prognosis updates all three charts and restores them at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/lab/prognosis-2100');
    const charts = page.locator('[_echarts_instance_]');
    await expectDrawnCharts(charts, 3);
    const originals = [];
    for (const chart of await charts.all()) originals.push(await stableChartImage(chart));
    const toggle = page.getByText('Show prognosis', { exact: true });
    await toggle.click();
    await expect(page.getByRole('checkbox', { name: 'Show prognosis' })).toBeChecked();
    await expectDrawnCharts(charts, 3);
    for (let i = 0; i < 3; i++)
      await expect
        .poll(async () => JSON.stringify(await stableChartImage(charts.nth(i))) !== JSON.stringify(originals[i]), {
          message: `Chart ${i + 1} shows a forecast`
        })
        .toBe(true);
    await toggle.click();
    await expect(page.getByRole('checkbox', { name: 'Show prognosis' })).not.toBeChecked();
    await expectDrawnCharts(charts, 3);
    for (let i = 0; i < 3; i++)
      await expect
        .poll(async () => JSON.stringify(await stableChartImage(charts.nth(i))) === JSON.stringify(originals[i]), {
          message: `Chart ${i + 1} restores historical data`
        })
        .toBe(true);
    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    await expectDrawnCharts(charts, 3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test(`Dutch climate article renders six charts and interactive heatmaps at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/lab/rising-temperatures');
    await expect(page.getByRole('heading', { level: 1, name: 'Rising Temperatures in The Netherlands' })).toBeVisible();
    const charts = page.locator('.article-body [_echarts_instance_]');
    await expectDrawnCharts(charts, 6);
    await charts.first().scrollIntoViewIfNeeded();
    await stableChartImage(charts.first());
    const yearly = (await charts.first().boundingBox())!;
    await page.mouse.move(yearly.x + yearly.width - 80, yearly.y + 110 + (yearly.height - 180) * 0.45);
    await expect(charts.first()).toContainText('1.4');
    await expect(charts.first()).toContainText('°C');
    for (const [index, value] of [
      [3, '+1.50 °C'],
      [4, '12 mm'],
      [5, '20 hours']
    ] as const) {
      const chart = charts.nth(index);
      await chart.scrollIntoViewIfNeeded();
      await stableChartImage(chart);
      const box = (await chart.boundingBox())!;
      await page.mouse.move(box.x + 100, box.y + 170);
      await expect(chart).toContainText('Anomaly');
      await expect(chart).toContainText(value);
    }
    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    await expectDrawnCharts(charts, 6);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('heading', { name: 'Sources and methodology' })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

for (const width of [390, 1440]) {
  test(`all climate charts use the refined palette and canvas typography at ${width}px`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 1000 });
    await page.addInitScript(() => {
      const labels: Array<{ text: string; font: string; color: string }> = [];
      (window as any).__chartLabels = labels;
      const original = CanvasRenderingContext2D.prototype.fillText;
      CanvasRenderingContext2D.prototype.fillText = function (text: string, x: number, y: number, maxWidth?: number) {
        if (/Temperature|Rainfall|Sunshine|Sea Level|Global CO2/.test(text)) {
          labels.push({ text, font: this.font, color: String(this.fillStyle) });
        }
        if (maxWidth === undefined) original.call(this, text, x, y);
        else original.call(this, text, x, y, maxWidth);
      };
    });
    for (const [route, count] of [
      ['/lab/prognosis-2100', 3],
      ['/lab/rising-temperatures', 6]
    ] as const) {
      await page.goto(route);
      const charts = page.locator('[_echarts_instance_]');
      for (const theme of ['dark', 'light']) {
        if ((await page.locator('html').getAttribute('class'))?.includes('dark') !== (theme === 'dark')) {
          await page.getByRole('button', { name: /switch to .* mode/i }).click();
        }
        await expectDrawnCharts(charts, count);
        const ink = theme === 'dark' ? '#e5e7eb' : '#111827';
        for (const chart of await charts.all()) {
          await expect
            .poll(() =>
              chart
                .locator('canvas')
                .first()
                .evaluate((canvas) => Array.from(canvas.getContext('2d')!.getImageData(0, 0, 1, 1).data))
            )
            .toEqual(theme === 'dark' ? [2, 6, 23, 255] : [255, 255, 255, 255]);
        }
        await expect
          .poll(() =>
            page.evaluate(
              (ink) => (window as any).__chartLabels.filter((label: { color: string }) => label.color === ink).length,
              ink
            )
          )
          .toBeGreaterThan(0);
        const fonts = await page.evaluate(
          (ink) =>
            (window as any).__chartLabels
              .filter((label: { color: string }) => label.color === ink)
              .map((label: { font: string }) => label.font),
          ink
        );
        expect(fonts.every((font: string) => font.includes('IBM Plex Sans'))).toBe(true);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
    }
  });
}

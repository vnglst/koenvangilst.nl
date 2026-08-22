import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import lobithData from './lobith-daily.json';

type Measure = 0 | 1;
type YearRecord = { year: number; values: (number | null)[] };

const years = lobithData.years as YearRecord[];
const firstYear = years[0]?.year ?? 1901;
const monthTicks = [0, 90, 181, 273, 364];
const monthLabels = ['Jan', 'Apr', 'Jul', 'Oct', 'Dec'];
const numberFormat = new Intl.NumberFormat('nl-NL');
const isNumber = (value: number | null): value is number => Number.isFinite(value);
const getLineProminence = (age: number) => 0.07 + 0.45 * Math.exp(-age / 60);
const drawDuration = 2_000;
const handoffDuration = 400;
const millisecondsPerYear = drawDuration + handoffDuration;
const handoffAlpha = 0.52;
const handoffWidth = 1.15;
const perspectiveDuration = 5_000;
const maxYRotationDegrees = 90;
const maxXRotationDegrees = 90;
const automaticYRotationDegrees = -62;
const automaticPerspective = automaticYRotationDegrees / maxYRotationDegrees;
const fieldDuration = years.length * millisecondsPerYear;
const chapterDuration = fieldDuration + perspectiveDuration;
const totalDuration = chapterDuration;

const measureConfig = [
  { title: 'Discharge', unit: 'm³/s', column: 0 as Measure },
  { title: 'Water level', unit: 'cm NAP', column: 1 as Measure }
];

function getExtent(measure: Measure) {
  const values = years
    .flatMap((record) => record.values.filter((_, index) => index % 2 === measure))
    .filter(isNumber);
  const minimum = Math.floor(Math.min(...values) / 250) * 250;
  const maximum = Math.ceil(Math.max(...values) / 1000) * 1000;
  return [minimum, maximum] as const;
}

const extents = [getExtent(0), getExtent(1)] as const;

function getSeasonalStats(measure: Measure) {
  return Array.from({ length: 365 }, (_, normalizedDay) => {
    const values = years.slice(0, -1).flatMap((record) => {
      const dayCount = record.values.length / 2;
      const dayIndex = Math.round((normalizedDay / 364) * (dayCount - 1));
      const value = record.values[dayIndex * 2 + measure];
      return isNumber(value) ? [value] : [];
    });
    const mean = values.reduce((total, value) => total + value, 0) / values.length;
    const variance = values.reduce((total, value) => total + (value - mean) ** 2, 0) / values.length;
    return { mean, deviation: Math.sqrt(variance) };
  });
}

const seasonalStats = [getSeasonalStats(0), getSeasonalStats(1)] as const;

function hexToRgb(hex: string) {
  const value = hex.replace('#', '');
  return [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16));
}

function mixColor(from: number[], to: number[], amount: number) {
  const channels = from.map((channel, index) => Math.round(channel + (to[index] - channel) * amount));
  return `rgb(${channels.join(' ')})`;
}

function getSignalColor(value: number, measure: Measure, normalizedDay: number, colors: number[][]) {
  const stats = seasonalStats[measure][normalizedDay];
  const score = (value - stats.mean) / stats.deviation;
  const signalStrength = Math.min(1, Math.max(0, (Math.abs(score) - 0.45) / 1.55));
  if (signalStrength === 0) return mixColor(colors[1], colors[1], 0);
  return score < 0
    ? mixColor(colors[1], colors[0], signalStrength)
    : mixColor(colors[1], colors[2], signalStrength);
}

function RiverCanvas({
  measure,
  visibleIndex,
  perspective,
  xRotationDegrees,
  drawProgress,
  handoffProgress,
  showGrid
}: {
  measure: Measure;
  visibleIndex: number;
  perspective: number;
  xRotationDegrees: number;
  drawProgress: number;
  handoffProgress: number;
  showGrid: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<() => void>(() => undefined);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    const cssWidth = container.clientWidth;
    const cssHeight = Math.max(340, Math.min(480, cssWidth * 0.78));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.round(cssWidth * pixelRatio);
    const pixelHeight = Math.round(cssHeight * pixelRatio);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    const context = canvas.getContext('2d');
    if (!context) return;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const styles = getComputedStyle(canvas);
    const foreground = styles.getPropertyValue('--river-foreground').trim();
    const grid = styles.getPropertyValue('--river-grid').trim();
    const signalColors = ['--river-below', '--river-average', '--river-above'].map((property) =>
      hexToRgb(styles.getPropertyValue(property).trim())
    );
    const [minimum, maximum] = extents[measure];
    const left = showGrid ? (cssWidth < 360 ? 40 : 48) : 8;
    const right = showGrid ? 14 : 8;
    const top = showGrid ? 18 : 8;
    const bottom = showGrid ? 34 : 8;
    const plotWidth = cssWidth - left - right;
    const plotHeight = cssHeight - top - bottom;
    const rotationAngle = perspective * maxYRotationDegrees * (Math.PI / 180);
    const rotationCosine = Math.max(0.001, Math.cos(rotationAngle));
    const rotationSine = Math.sin(Math.abs(rotationAngle));
    const depthRatio = 0.62;
    const projectionWidth = rotationCosine + rotationSine * depthRatio;
    const dayWidth = (plotWidth * rotationCosine) / projectionWidth;
    const timeDepth =
      Math.sign(rotationAngle) * ((plotWidth * rotationSine * depthRatio) / projectionWidth);
    const timeOrigin = left + Math.max(0, -timeDepth);
    const frontStart = timeOrigin + timeDepth;
    const xRotationAngle = xRotationDegrees * (Math.PI / 180);
    const xRotationCosine = Math.max(0.001, Math.cos(xRotationAngle));
    const xRotationSine = Math.sin(Math.abs(xRotationAngle));
    const verticalDepthRatio = 0.55;
    const verticalProjection = xRotationCosine + xRotationSine * verticalDepthRatio;
    const verticalSpace = plotHeight * 0.88;
    const amplitude = (verticalSpace * xRotationCosine) / verticalProjection;
    const verticalTimeDepth =
      Math.sign(xRotationAngle) *
      ((verticalSpace * xRotationSine * verticalDepthRatio) / verticalProjection);
    const valueTop = top + Math.max(0, -verticalTimeDepth);
    const backBaseline = valueTop + amplitude;
    const frontBaseline = backBaseline + verticalTimeDepth;
    const availableYears = years.slice(0, visibleIndex + 1);
    const localDenominator = Math.max(availableYears.length - 1, 1);

    context.clearRect(0, 0, cssWidth, cssHeight);
    context.font = '11px "IBM Plex Sans", sans-serif';
    context.textBaseline = 'middle';
    context.fillStyle = foreground;

    context.strokeStyle = grid;
    context.lineWidth = 1;
    for (let tickIndex = 0; tickIndex < monthTicks.length; tickIndex += 1) {
      const tickPosition = monthTicks[tickIndex] / 364;
      const x = frontStart + tickPosition * dayWidth;
      if (showGrid) {
        context.beginPath();
        context.moveTo(x, frontBaseline - amplitude);
        context.lineTo(x, frontBaseline);
        context.stroke();
      }
      if (showGrid) {
        context.textAlign =
          tickIndex === 0 ? 'left' : tickIndex === monthTicks.length - 1 ? 'right' : 'center';
        context.fillText(monthLabels[tickIndex], x, cssHeight - 13);
      }
    }

    const axisValues = [maximum, Math.round((minimum + maximum) / 2), minimum];
    axisValues.forEach((value, index) => {
      const y = frontBaseline - amplitude + (index / 2) * amplitude;
      if (showGrid) {
        context.textAlign = 'right';
        context.fillText(numberFormat.format(value), frontStart - 7, y);
        context.strokeStyle = grid;
        context.beginPath();
        context.moveTo(frontStart, y);
        context.lineTo(frontStart + dayWidth, y);
        context.stroke();
      }
    });

    availableYears.forEach((record, index) => {
      const localDepth = index / localDenominator;
      const age = availableYears.length - 1 - index;
      const effectiveAge = age + handoffProgress;
      const recedingDepth = 1 - Math.exp(-effectiveAge / 20);
      const xRotationProgress = Math.abs(xRotationDegrees) / maxXRotationDegrees;
      const yRotationProgress = Math.min(
        1,
        Math.abs((perspective * maxYRotationDegrees) / automaticYRotationDegrees)
      );
      const stackInfluence = 1 - Math.max(yRotationProgress, xRotationProgress);
      const stackX = recedingDepth * 26 * stackInfluence;
      const stackY = recedingDepth * plotHeight * 0.11 * stackInfluence;
      const lineScale = 1 - recedingDepth * 0.09 * stackInfluence;
      const baseline = backBaseline + verticalTimeDepth * localDepth - stackY;
      const xOffset = timeOrigin - left + timeDepth * localDepth + stackX;
      const projectedWidth = dayWidth * lineScale;
      const prominence = getLineProminence(age);
      const previousProminence = age === 1 ? handoffAlpha : getLineProminence(age - 1);
      const isNewest = index === availableYears.length - 1;
      const isPrevious = index === availableYears.length - 2;
      const dayCount = record.values.length / 2;
      const calendarDayCount = new Date(record.year, 1, 29).getDate() === 29 ? 366 : 365;
      const lineStart = left + xOffset;
      const lineEnd = lineStart + projectedWidth;
      const signalGradient = context.createLinearGradient(lineStart, 0, lineEnd, 0);

      for (let dayIndex = 0; dayIndex < dayCount; dayIndex += isNewest ? 1 : 3) {
        const value = record.values[dayIndex * 2 + measure];
        if (!isNumber(value)) continue;
        const normalizedDay = Math.round((dayIndex / (calendarDayCount - 1)) * 364);
        signalGradient.addColorStop(
          dayIndex / (calendarDayCount - 1),
          getSignalColor(value, measure, normalizedDay, signalColors)
        );
      }

      const points = Array.from({ length: dayCount }, (_, dayIndex) => {
        const value = record.values[dayIndex * 2 + measure];
        if (!isNumber(value)) return null;
        const x = lineStart + (dayIndex / (calendarDayCount - 1)) * projectedWidth;
        const normalizedValue = (value - minimum) / (maximum - minimum);
        return { x, y: baseline - normalizedValue * amplitude * lineScale };
      });
      let totalLength = 0;
      for (let pointIndex = 1; pointIndex < points.length; pointIndex += 1) {
        const previous = points[pointIndex - 1];
        const point = points[pointIndex];
        if (previous && point) totalLength += Math.hypot(point.x - previous.x, point.y - previous.y);
      }
      const targetLength = isNewest ? totalLength * drawProgress : totalLength;

      context.beginPath();
      context.strokeStyle = signalGradient;
      context.globalAlpha = isNewest
        ? 1 + (handoffAlpha - 1) * handoffProgress
        : previousProminence + (prominence - previousProminence) * drawProgress;
      context.lineWidth = isNewest
        ? 2.1 + (handoffWidth - 2.1) * handoffProgress
        : isPrevious
          ? handoffWidth + (0.9 - handoffWidth) * drawProgress
          : 0.9;
      context.lineJoin = 'round';
      context.lineCap = 'round';

      let previousPoint: { x: number; y: number } | null = null;
      let travelled = 0;
      for (const point of points) {
        if (!point) {
          previousPoint = null;
          continue;
        }
        if (!previousPoint) {
          context.moveTo(point.x, point.y);
          previousPoint = point;
          continue;
        }

        const segmentLength = Math.hypot(point.x - previousPoint.x, point.y - previousPoint.y);
        if (travelled + segmentLength > targetLength) {
          const remaining = Math.max(0, targetLength - travelled);
          const amount = segmentLength === 0 ? 0 : remaining / segmentLength;
          context.lineTo(
            previousPoint.x + (point.x - previousPoint.x) * amount,
            previousPoint.y + (point.y - previousPoint.y) * amount
          );
          break;
        }

        context.lineTo(point.x, point.y);
        travelled += segmentLength;
        previousPoint = point;
      }
      context.stroke();
    });

    if (showGrid) {
      context.globalAlpha = 1;
      context.fillStyle = foreground;
      if (Math.abs(timeDepth) >= 40) {
        context.textAlign = 'left';
        context.fillText(
          String(availableYears[0]?.year ?? firstYear),
          timeOrigin + 3,
          backBaseline + 12
        );
        context.fillText(
          String(availableYears.at(-1)?.year ?? firstYear),
          frontStart + 3,
          frontBaseline + 12
        );
      } else {
        context.textAlign = 'right';
        context.fillText(
          String(availableYears.at(-1)?.year ?? firstYear),
          left + plotWidth,
          frontBaseline + 12
        );
      }
    }
  }, [drawProgress, handoffProgress, measure, perspective, showGrid, visibleIndex, xRotationDegrees]);

  useEffect(() => {
    draw();
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const redraw = () => drawRef.current();
    const resizeObserver = new ResizeObserver(redraw);
    const themeObserver = new MutationObserver(redraw);
    resizeObserver.observe(canvas.parentElement ?? canvas);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      resizeObserver.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  const config = measureConfig[measure];
  return (
    <section className="min-w-0" aria-labelledby={`river-${measure}-title`}>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h3 id={`river-${measure}-title`} className="nimbus !m-0 !text-base tracking-wide uppercase">
          {config.title}
        </h3>
        {showGrid && <span className="text-xs text-gray-500 dark:text-gray-400">{config.unit}</span>}
      </div>
      <div className="w-full">
        <canvas
          ref={canvasRef}
          className="block aspect-[1.28] max-h-[480px] min-h-[340px] w-full [--river-above:#d24f2f] [--river-average:#9ca3af] [--river-below:#007cc3] [--river-foreground:#4b5563] [--river-grid:rgba(107,114,128,0.18)] dark:[--river-above:#ff7a4f] dark:[--river-average:#6b7280] dark:[--river-below:#45c3ff] dark:[--river-foreground:#d1d5db] dark:[--river-grid:rgba(156,163,175,0.16)]"
          role="img"
          aria-label={`${config.title} at Lobith, yearly daily lines from ${firstYear} through ${years[visibleIndex]?.year ?? firstYear}`}
        />
      </div>
    </section>
  );
}

function getYearSummary(record: YearRecord) {
  return measureConfig.map(({ column, unit }) => {
    const values = record.values.filter((_, index) => index % 2 === column).filter(isNumber);
    return `${numberFormat.format(Math.min(...values))}-${numberFormat.format(Math.max(...values))} ${unit}`;
  });
}

type FieldState = {
  visibleIndex: number;
  perspective: number;
  drawProgress: number;
  handoffProgress: number;
};

type TimelineStatus = {
  visibleIndex: number;
  turning: boolean;
  handingOff: boolean;
};

const emptyField: FieldState = { visibleIndex: 0, perspective: 0, drawProgress: 0, handoffProgress: 0 };
const completeField: FieldState = {
  visibleIndex: years.length - 1,
  perspective: automaticPerspective,
  drawProgress: 1,
  handoffProgress: 1
};

function getFieldState(time: number): FieldState {
  const localTime = time;
  if (localTime <= 0) return emptyField;

  if (localTime < fieldDuration) {
    const yearPosition = localTime / millisecondsPerYear;
    const yearTime = localTime % millisecondsPerYear;
    return {
      visibleIndex: Math.min(years.length - 1, Math.floor(yearPosition)),
      perspective: 0,
      drawProgress: Math.min(1, yearTime / drawDuration),
      handoffProgress: Math.max(0, (yearTime - drawDuration) / handoffDuration)
    };
  }

  if (localTime < chapterDuration) {
    return {
      visibleIndex: years.length - 1,
      perspective: automaticPerspective * ((localTime - fieldDuration) / perspectiveDuration),
      drawProgress: 1,
      handoffProgress: 1
    };
  }

  return completeField;
}

function getTimelineStatus(time: number): TimelineStatus {
  if (time < fieldDuration) {
    const yearTime = time % millisecondsPerYear;
    return {
      visibleIndex: Math.floor(time / millisecondsPerYear),
      turning: false,
      handingOff: yearTime >= drawDuration
    };
  }
  return { visibleIndex: years.length - 1, turning: true, handingOff: false };
}

export function RhineYearField() {
  const reducedMotion = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const timelineRef = useRef(0);
  const rotationOverrideRef = useRef<number | null>(null);
  const [fieldStates, setFieldStates] = useState<[FieldState, FieldState]>([emptyField, emptyField]);
  const [status, setStatus] = useState<TimelineStatus | null>({
    visibleIndex: 0,
    turning: false,
    handingOff: false
  });
  const [manualIndex, setManualIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGuides, setShowGuides] = useState(false);
  const [xRotationDegrees, setXRotationDegrees] = useState(0);
  const displayIndex = status?.visibleIndex ?? manualIndex;
  const rotationDegrees = Math.round(fieldStates[0].perspective * maxYRotationDegrees);
  const summary = useMemo(() => getYearSummary(years[displayIndex]), [displayIndex]);

  const stopAnimation = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    setIsPlaying(false);
  }, []);

  const applyTimeline = useCallback((time: number) => {
    const boundedTime = Math.min(totalDuration, Math.max(0, time));
    const timelineStatus = boundedTime >= totalDuration ? null : getTimelineStatus(boundedTime);
    timelineRef.current = boundedTime;
    const automaticFieldState = getFieldState(boundedTime);
    const fieldState = {
      ...automaticFieldState,
      perspective: rotationOverrideRef.current ?? automaticFieldState.perspective
    };
    setFieldStates([fieldState, fieldState]);
    setStatus(timelineStatus);
    setManualIndex(timelineStatus?.visibleIndex ?? years.length - 1);
  }, []);

  const play = useCallback(
    (restart = false) => {
      stopAnimation();
      if (restart || timelineRef.current >= totalDuration) {
        rotationOverrideRef.current = null;
        setXRotationDegrees(0);
        applyTimeline(0);
      }
      const startTimeline = timelineRef.current;
      const startTime = performance.now();
      setIsPlaying(true);

      const animate = (time: number) => {
        const nextTimeline = reducedMotion.current ? totalDuration : startTimeline + time - startTime;
        applyTimeline(nextTimeline);

        if (nextTimeline < totalDuration) frameRef.current = requestAnimationFrame(animate);
        else {
          frameRef.current = null;
          setIsPlaying(false);
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    },
    [applyTimeline, stopAnimation]
  );

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          if (reducedMotion.current) {
            applyTimeline(totalDuration);
          } else play(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [applyTimeline, play]);

  const onYearChange = (index: number) => {
    stopAnimation();
    timelineRef.current = Math.min(fieldDuration, index * millisecondsPerYear + drawDuration);
    const fieldState = {
      visibleIndex: index,
      perspective: rotationOverrideRef.current ?? (index === years.length - 1 ? automaticPerspective : 0),
      drawProgress: 1,
      handoffProgress: 0
    };
    setFieldStates([fieldState, fieldState]);
    setManualIndex(index);
    setStatus(null);
  };

  const onRotationChange = (degrees: number) => {
    stopAnimation();
    const perspective = degrees / maxYRotationDegrees;
    rotationOverrideRef.current = perspective;
    setFieldStates(([discharge, waterLevel]) => [
      { ...discharge, perspective },
      { ...waterLevel, perspective }
    ]);
    setStatus(null);
  };

  const onXRotationChange = (degrees: number) => {
    stopAnimation();
    setXRotationDegrees(degrees);
    setStatus(null);
  };

  return (
    <div
      ref={rootRef}
      className="not-prose my-10 w-full"
      aria-label="The Rhine at Lobith through time"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-gray-200 pb-4 dark:border-gray-800">
        <div>
          <p className="nimbus m-0 text-3xl leading-none tracking-tight tabular-nums">{years[displayIndex].year}</p>
          <p className="mt-1 mb-0 text-xs text-gray-500 dark:text-gray-400">
            {status
              ? `${status.turning ? 'Rotating both views around the y-axis' : status.handingOff ? 'Receding both lines' : 'Drawing both lines'} · ${status.visibleIndex + 1} of ${years.length}`
              : `Both views through ${years[manualIndex].year}`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => (isPlaying ? stopAnimation() : play())}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={() => play(true)}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900"
          >
            Restart
          </button>
        </div>
      </div>

      <label className="mb-6 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
        <input
          type="checkbox"
          checked={showGuides}
          onChange={(event) => setShowGuides(event.target.checked)}
          className="accent-gray-900 dark:accent-gray-100"
        />
        Show axes, grid and color key
      </label>

      {showGuides && (
        <div className="mb-6 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span>Below average</span>
          <span className="h-1.5 min-w-24 flex-1 bg-gradient-to-r from-[#007cc3] via-[#9ca3af] to-[#d24f2f] dark:from-[#45c3ff] dark:via-[#6b7280] dark:to-[#ff7a4f]" />
          <span>Above average</span>
        </div>
      )}

      <label
        className="mb-2 block text-xs font-medium text-gray-600 dark:text-gray-300"
        htmlFor="lobith-x-rotation"
      >
        X-axis rotation {xRotationDegrees}°
      </label>
      <input
        id="lobith-x-rotation"
        className="mb-5 w-full accent-gray-900 dark:accent-gray-100"
        type="range"
        min={-maxXRotationDegrees}
        max={maxXRotationDegrees}
        value={xRotationDegrees}
        onChange={(event) => onXRotationChange(Number(event.target.value))}
      />

      <label
        className="mb-2 block text-xs font-medium text-gray-600 dark:text-gray-300"
        htmlFor="lobith-rotation"
      >
        Y-axis rotation {rotationDegrees}°
      </label>
      <input
        id="lobith-rotation"
        className="mb-8 w-full accent-gray-900 dark:accent-gray-100"
        type="range"
        min={-maxYRotationDegrees}
        max={maxYRotationDegrees}
        value={rotationDegrees}
        onChange={(event) => onRotationChange(Number(event.target.value))}
      />

      <div className="space-y-12">
        <RiverCanvas
          measure={0}
          visibleIndex={fieldStates[0].visibleIndex}
          perspective={fieldStates[0].perspective}
          xRotationDegrees={xRotationDegrees}
          drawProgress={fieldStates[0].drawProgress}
          handoffProgress={fieldStates[0].handoffProgress}
          showGrid={showGuides}
        />
        <RiverCanvas
          measure={1}
          visibleIndex={fieldStates[1].visibleIndex}
          perspective={fieldStates[1].perspective}
          xRotationDegrees={xRotationDegrees}
          drawProgress={fieldStates[1].drawProgress}
          handoffProgress={fieldStates[1].handoffProgress}
          showGrid={showGuides}
        />
      </div>

      <label className="mt-5 block text-xs font-medium text-gray-600 dark:text-gray-300" htmlFor="lobith-year">
        Through {years[displayIndex].year}
      </label>
      <input
        id="lobith-year"
        className="mt-2 w-full accent-gray-900 dark:accent-gray-100"
        type="range"
        min={0}
        max={years.length - 1}
        value={displayIndex}
        onChange={(event) => onYearChange(Number(event.target.value))}
      />
      <p className="mt-2 mb-0 text-xs text-gray-500 tabular-nums dark:text-gray-400" aria-live="polite">
        {years[displayIndex].year}: discharge {summary[0]} · water level {summary[1]}
        {displayIndex === years.length - 1 ? ` · partial year through ${lobithData.updatedThrough}` : ''}
      </p>
    </div>
  );
}

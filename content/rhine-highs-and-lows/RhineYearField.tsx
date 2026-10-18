import { Canvas, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

import { Button } from '#/components/ui/Button';
import { Toggle } from '#/components/forms/Toggle';
import { Range } from '#/components/forms/Range';
import { Select } from '#/components/forms/Select';

import lobithData from './lobith-daily.json';
import { rhinePalettes } from './rhine-palettes';
import type { RhinePalette } from './rhine-palettes';

type Measure = 0 | 1;
type YearRecord = { year: number; values: (number | null)[] };

const years = lobithData.years as YearRecord[];
const firstYear = years[0]?.year ?? 1901;
const monthLabels = ['Jan', 'Jul', 'Dec'];
const numberFormat = new Intl.NumberFormat('en-GB');
const isNumber = (value: number | null): value is number => Number.isFinite(value);
const getLineProminence = (age: number) => 0.22 + 0.43 * Math.exp(-age / 65);
const drawDuration = 2_000;
const handoffDuration = 400;
const millisecondsPerYear = drawDuration + handoffDuration;
const handoffAlpha = 0.52;
const handoffWidth = 2.25;
const perspectiveDuration = 5_000;
const maxYRotationDegrees = 90;
const maxXRotationDegrees = 90;
const defaultXRotationDegrees = 25;
const defaultYRotationDegrees = 8;
const automaticYRotationDegrees = -62;
const defaultPerspective = defaultYRotationDegrees / maxYRotationDegrees;
const automaticPerspective = automaticYRotationDegrees / maxYRotationDegrees;
const fieldDepth = 16;
const fieldDuration = years.length * millisecondsPerYear;
const chapterDuration = fieldDuration + perspectiveDuration;
const totalDuration = chapterDuration;
const playbackSpeeds = [0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 10] as const;

const measureConfig = [
  { title: 'River flow', unit: 'm³/s', column: 0 as Measure },
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

function getSignalColor(
  value: number,
  measure: Measure,
  normalizedDay: number,
  colors: readonly [THREE.Color, THREE.Color, THREE.Color, THREE.Color, THREE.Color, THREE.Color]
) {
  const stats = seasonalStats[measure][normalizedDay];
  const score = (value - stats.mean) / stats.deviation;
  if (score <= -2) return colors[1].clone().lerp(colors[0], Math.min(1, (-score - 2) / 2));
  if (score <= 0) return colors[1].clone().lerp(colors[2], (score + 2) / 2);
  if (score <= 1.5) return colors[2].clone().lerp(colors[3], score / 1.5);
  if (score <= 2.5) return colors[3].clone().lerp(colors[4], score - 1.5);
  return colors[4].clone().lerp(colors[5], Math.min(1, (score - 2.5) / 1.5));
}

type SegmentData = {
  positions: number[];
  colors: number[];
  distances: number[];
  length: number;
};

function getYearGeometry(record: YearRecord, measure: Measure, palette: RhinePalette) {
  const [minimum, maximum] = extents[measure];
  const signalColors = palette.map((color) => new THREE.Color(color)) as [
    THREE.Color,
    THREE.Color,
    THREE.Color,
    THREE.Color,
    THREE.Color,
    THREE.Color
  ];
  const calendarDayCount = new Date(record.year, 1, 29).getDate() === 29 ? 366 : 365;
  const dayCount = record.values.length / 2;
  const segments: SegmentData[] = [];
  let positions: number[] = [];
  let colors: number[] = [];
  let distances: number[] = [];
  let segmentLength = 0;
  let previousPoint: [number, number] | null = null;

  const finishSegment = () => {
    if (positions.length >= 6) segments.push({ positions, colors, distances, length: segmentLength });
    positions = [];
    colors = [];
    distances = [];
    segmentLength = 0;
    previousPoint = null;
  };

  for (let dayIndex = 0; dayIndex < dayCount; dayIndex += 1) {
    const value = record.values[dayIndex * 2 + measure];
    if (!isNumber(value)) {
      finishSegment();
      continue;
    }

    const x = (dayIndex / (calendarDayCount - 1) - 0.5) * 7;
    const y = ((value - minimum) / (maximum - minimum) - 0.5) * 4.4;
    if (previousPoint) segmentLength += Math.hypot(x - previousPoint[0], y - previousPoint[1]);
    distances.push(segmentLength);
    positions.push(x, y, 0);
    const normalizedDay = Math.round((dayIndex / (calendarDayCount - 1)) * 364);
    const color = getSignalColor(value, measure, normalizedDay, signalColors);
    colors.push(color.r, color.g, color.b);
    previousPoint = [x, y];
  }
  finishSegment();

  return { segments, totalLength: segments.reduce((total, segment) => total + segment.length, 0) };
}

// Three.js objects are mutable scene resources, updated after React renders.
function updateLineAppearance(line: Line2, visibleSegments: number, opacity: number, width: number, renderOrder: number) {
  line.geometry.instanceCount = visibleSegments;
  line.visible = line.geometry.instanceCount > 0;
  line.material.opacity = opacity;
  line.material.uniforms.linewidth.value = width;
  line.renderOrder = renderOrder;
}

function updateCameraZoom(camera: THREE.OrthographicCamera, zoom: number) {
  camera.zoom = zoom;
  camera.updateProjectionMatrix();
}

function ThickLine({
  data,
  visibleLength,
  opacity,
  width,
  renderOrder
}: {
  data: SegmentData;
  visibleLength: number;
  opacity: number;
  width: number;
  renderOrder: number;
}) {
  const invalidate = useThree((state) => state.invalidate);
  const geometry = useMemo(() => {
    const nextGeometry = new LineGeometry();
    nextGeometry.setPositions(data.positions);
    nextGeometry.setColors(data.colors);
    return nextGeometry;
  }, [data]);
  const material = useMemo(() => {
    const nextMaterial = new LineMaterial();
    nextMaterial.vertexColors = true;
    nextMaterial.transparent = true;
    nextMaterial.depthWrite = false;
    nextMaterial.toneMapped = false;
    return nextMaterial;
  }, []);
  const line = useMemo(() => {
    const nextLine = new Line2(geometry, material);
    nextLine.frustumCulled = false;
    return nextLine;
  }, [geometry, material]);

  useEffect(() => {
    let visibleSegments = 0;
    while (
      visibleSegments < data.distances.length - 1 &&
      data.distances[visibleSegments + 1] <= visibleLength
    ) {
      visibleSegments += 1;
    }
    updateLineAppearance(line, visibleSegments, opacity, width, renderOrder);
    invalidate();
  }, [data.distances, geometry, invalidate, line, material, opacity, renderOrder, visibleLength, width]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material]
  );

  return <primitive object={line} />;
}

function YearLine({
  record,
  measure,
  palette,
  age,
  index,
  visibleIndex,
  drawProgress,
  handoffProgress,
  z
}: {
  record: YearRecord;
  measure: Measure;
  palette: RhinePalette;
  age: number;
  index: number;
  visibleIndex: number;
  drawProgress: number;
  handoffProgress: number;
  z: number;
}) {
  const geometryData = useMemo(
    () => getYearGeometry(record, measure, palette),
    [measure, palette, record]
  );
  const prominence = getLineProminence(age);
  const previousProminence = age === 1 ? handoffAlpha : getLineProminence(age - 1);
  const isNewest = index === visibleIndex;
  const isPrevious = index === visibleIndex - 1;
  const opacity = isNewest
    ? 1 + (handoffAlpha - 1) * handoffProgress
    : previousProminence + (prominence - previousProminence) * drawProgress;
  const width = isNewest
    ? 4.2 + (handoffWidth - 4.2) * handoffProgress
    : isPrevious
      ? handoffWidth + (1.9 - handoffWidth) * drawProgress
      : 1.9;
  const targetLength = isNewest ? geometryData.totalLength * drawProgress : geometryData.totalLength;

  return (
    <group position={[0, 0, z]}>
      {geometryData.segments.map((segment, segmentIndex) => {
        const traversedLength = geometryData.segments
          .slice(0, segmentIndex)
          .reduce((total, previous) => total + previous.length, 0);
        const visibleLength = Math.max(0, Math.min(segment.length, targetLength - traversedLength));
        return (
          <ThickLine
            key={`${record.year}-${segmentIndex}`}
            data={segment}
            visibleLength={visibleLength}
            opacity={opacity}
            width={width}
            renderOrder={index}
          />
        );
      })}
    </group>
  );
}

function CameraRig({
  depthSpan,
  xRotationDegrees,
  yRotationDegrees
}: {
  depthSpan: number;
  xRotationDegrees: number;
  yRotationDegrees: number;
}) {
  const camera = useThree((state) => state.camera) as THREE.OrthographicCamera;
  const size = useThree((state) => state.size);
  const invalidate = useThree((state) => state.invalidate);
  const projectedSize = useMemo(() => {
    const rotation = new THREE.Euler(
      THREE.MathUtils.degToRad(xRotationDegrees),
      THREE.MathUtils.degToRad(yRotationDegrees),
      0
    );
    let minimumX = Infinity;
    let maximumX = -Infinity;
    let minimumY = Infinity;
    let maximumY = -Infinity;

    for (const x of [-3.5, 3.8]) {
      for (const y of [-2.34, 2.2]) {
        for (const z of [-depthSpan / 2, depthSpan / 2]) {
          const corner = new THREE.Vector3(x, y, z).applyEuler(rotation);
          minimumX = Math.min(minimumX, corner.x);
          maximumX = Math.max(maximumX, corner.x);
          minimumY = Math.min(minimumY, corner.y);
          maximumY = Math.max(maximumY, corner.y);
        }
      }
    }

    return {
      width: 2 * Math.max(Math.abs(minimumX), Math.abs(maximumX)),
      height: 2 * Math.max(Math.abs(minimumY), Math.abs(maximumY))
    };
  }, [depthSpan, xRotationDegrees, yRotationDegrees]);

  useEffect(() => {
    const fittedWidth = Math.max(8.6, projectedSize.width + 0.8);
    const fittedHeight = Math.max(6.3, projectedSize.height + 0.8);
    updateCameraZoom(camera, Math.min(size.width / fittedWidth, size.height / fittedHeight));
    invalidate();
  }, [camera, invalidate, projectedSize.height, projectedSize.width, size.height, size.width]);

  return null;
}

function RiverField({
  measure,
  visibleIndex,
  perspective,
  xRotationDegrees,
  drawProgress,
  handoffProgress,
  showAxes,
  dark
}: {
  measure: Measure;
  visibleIndex: number;
  perspective: number;
  xRotationDegrees: number;
  drawProgress: number;
  handoffProgress: number;
  showAxes: boolean;
  dark: boolean;
}) {
  const config = measureConfig[measure];
  const [minimum, maximum] = extents[measure];
  const palette = dark ? rhinePalettes.dark : rhinePalettes.light;
  const yRotationDegrees = perspective * maxYRotationDegrees;
  const depthSpan = ((visibleIndex + handoffProgress) / Math.max(years.length - 1, 1)) * fieldDepth;
  const rotationStrength = Math.min(
    1,
    Math.max(Math.abs(xRotationDegrees) / 35, Math.abs(yRotationDegrees) / 35)
  );
  const availableYears = years.slice(0, visibleIndex + 1);

  return (
    <section className="min-w-0" aria-labelledby={`river-${measure}-title`}>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h3
          id={`river-${measure}-title`}
          className="flex flex-wrap items-baseline gap-x-2 !m-0 !text-base"
        >
          {config.title}
          {showAxes && (
            <span className="font-sans text-[11px] font-normal tracking-normal text-gray-600 normal-case dark:text-gray-400">
              at Lobith · {config.unit}
            </span>
          )}
        </h3>
      </div>
      <div
        className="relative aspect-[1.28] max-h-[480px] min-h-[260px] w-full"
        role="img"
        aria-label={`${config.title} at Lobith, yearly daily lines from ${firstYear} through ${years[visibleIndex]?.year ?? firstYear}`}
      >
        <div className="absolute inset-2">
          <Canvas
            orthographic
            frameloop="demand"
            dpr={[1, 2]}
            camera={{ position: [0, 0, 12], near: 0.1, far: 100 }}
            gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            fallback={<p className="text-xs text-gray-500">3D rendering is not available.</p>}
          >
            <CameraRig
              depthSpan={depthSpan}
              xRotationDegrees={xRotationDegrees}
              yRotationDegrees={yRotationDegrees}
            />
            <group
              rotation={[
                THREE.MathUtils.degToRad(xRotationDegrees),
                THREE.MathUtils.degToRad(yRotationDegrees),
                0
              ]}
            >
              {availableYears.map((record, index) => {
                const age = visibleIndex - index;
                const effectiveAge = age + handoffProgress;
                const z = depthSpan / 2 - (effectiveAge / Math.max(years.length - 1, 1)) * fieldDepth;
                const recedingDepth = 1 - Math.exp(-effectiveAge / 20);
                const stackInfluence = 1 - rotationStrength;
                return (
                  <group
                    key={record.year}
                    position={[recedingDepth * 0.3 * stackInfluence, -recedingDepth * 0.14 * stackInfluence, 0]}
                  >
                    <YearLine
                      record={record}
                      measure={measure}
                      palette={palette}
                      age={age}
                      index={index}
                      visibleIndex={visibleIndex}
                      drawProgress={drawProgress}
                      handoffProgress={handoffProgress}
                      z={z}
                    />
                  </group>
                );
              })}
            </group>
          </Canvas>
        </div>

        {showAxes && (
          <>
            <div className="pointer-events-none absolute top-4 bottom-7 left-3 flex flex-col justify-between text-[11px] text-gray-600 tabular-nums dark:text-gray-400">
              <span>{numberFormat.format(maximum)}</span>
              <span>{numberFormat.format(minimum)}</span>
            </div>
            <div className="pointer-events-none absolute right-3 bottom-3 left-3 flex justify-between text-[11px] text-gray-600 dark:text-gray-400">
              {monthLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </>
        )}
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

const emptyField: FieldState = {
  visibleIndex: 0,
  perspective: defaultPerspective,
  drawProgress: 0,
  handoffProgress: 0
};
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
      perspective: defaultPerspective,
      drawProgress: Math.min(1, yearTime / drawDuration),
      handoffProgress: Math.max(0, (yearTime - drawDuration) / handoffDuration)
    };
  }

  if (localTime < chapterDuration) {
    return {
      visibleIndex: years.length - 1,
      perspective:
        defaultPerspective +
        (automaticPerspective - defaultPerspective) * ((localTime - fieldDuration) / perspectiveDuration),
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

function useDarkTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const update = () => setDark(document.documentElement.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return dark;
}

export function RhineYearField() {
  const reducedMotion = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const timelineRef = useRef(0);
  const rotationOverrideRef = useRef<number | null>(null);
  const rotationDragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    xRotation: number;
    yRotation: number;
  } | null>(null);
  const speedRef = useRef(1.5);
  const [fieldState, setFieldState] = useState<FieldState>(emptyField);
  const [status, setStatus] = useState<TimelineStatus | null>({
    visibleIndex: 0,
    turning: false,
    handingOff: false
  });
  const [manualIndex, setManualIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGuides, setShowGuides] = useState(true);
  const [showWaterLevel, setShowWaterLevel] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.5);
  const [xRotationDegrees, setXRotationDegrees] = useState(defaultXRotationDegrees);
  const dark = useDarkTheme();
  const displayIndex = status?.visibleIndex ?? manualIndex;
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
    setFieldState(fieldState);
    setStatus(timelineStatus);
    setManualIndex(timelineStatus?.visibleIndex ?? years.length - 1);
  }, []);

  const play = useCallback(
    (restart = false) => {
      stopAnimation();
      if (restart || timelineRef.current >= totalDuration) {
        rotationOverrideRef.current = null;
        setXRotationDegrees(defaultXRotationDegrees);
        applyTimeline(0);
      }
      let previousTime = performance.now();
      setIsPlaying(true);

      const animate = (time: number) => {
        const elapsed = Math.max(0, time - previousTime);
        previousTime = time;
        const nextTimeline = reducedMotion.current
          ? totalDuration
          : timelineRef.current + elapsed * speedRef.current;
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
      perspective:
        rotationOverrideRef.current ?? (index === years.length - 1 ? automaticPerspective : defaultPerspective),
      drawProgress: 1,
      handoffProgress: 0
    };
    setFieldState(fieldState);
    setManualIndex(index);
    setStatus(null);
  };

  const onRotationChange = (degrees: number) => {
    const perspective = degrees / maxYRotationDegrees;
    rotationOverrideRef.current = perspective;
    setFieldState((current) => ({ ...current, perspective }));
  };

  const startRotationDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if (event.pointerType === 'mouse') event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    rotationDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      xRotation: xRotationDegrees,
      yRotation: fieldState.perspective * maxYRotationDegrees
    };
  };

  const continueRotationDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = rotationDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.pointerType === 'mouse') event.preventDefault();
    const nextXRotation = Math.max(
      -maxXRotationDegrees,
      Math.min(maxXRotationDegrees, drag.xRotation - (event.clientY - drag.startY) * 0.3)
    );
    const nextYRotation = Math.max(
      -maxYRotationDegrees,
      Math.min(maxYRotationDegrees, drag.yRotation + (event.clientX - drag.startX) * 0.3)
    );
    if (event.pointerType !== 'touch') setXRotationDegrees(nextXRotation);
    onRotationChange(nextYRotation);
  };

  const finishRotationDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (rotationDragRef.current?.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    rotationDragRef.current = null;
  };

  const setView = (landscape: boolean) => {
    stopAnimation();
    setXRotationDegrees(landscape ? defaultXRotationDegrees : 0);
    onRotationChange(landscape ? automaticYRotationDegrees : 0);
  };

  return (
    <div
      ref={rootRef}
      className="not-prose my-10 w-full"
      role="region"
      aria-label="The Rhine at Lobith through time"
    >
      <div className="mb-6 border-y border-gray-200 py-4 dark:border-gray-800">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl leading-none tracking-tight tabular-nums">{years[displayIndex].year}</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">at Lobith</span>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => (isPlaying ? stopAnimation() : play())}
              size="sm"
              className="min-w-20"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button type="button" onClick={() => play(true)} variant="outline" size="sm">
              Restart
            </Button>
          </div>
        </div>
        <Range
          id="lobith-year"
          label="Year"
          hideLabel
          aria-valuetext={String(years[displayIndex].year)}
          className="mt-2"
          min={0}
          max={years.length - 1}
          value={displayIndex}
          onChange={(event) => onYearChange(Number(event.target.value))}
        />
        <div className="flex justify-between text-xs text-gray-600 tabular-nums dark:text-gray-400" aria-hidden="true">
          <span>{firstYear}</span>
          <span>{years.at(-1)?.year}</span>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2" role="group" aria-label="Chart view">
          <Button type="button" onClick={() => setView(false)} variant="outline" size="sm"
            aria-pressed={xRotationDegrees === 0 && fieldState.perspective === 0}>
            Front view
          </Button>
          <Button type="button" onClick={() => setView(true)} variant="outline" size="sm"
            aria-pressed={xRotationDegrees === defaultXRotationDegrees && fieldState.perspective === automaticPerspective}>
            Landscape
          </Button>
        </div>
        <span className="text-xs text-gray-600 dark:text-gray-400">Drag to rotate</span>
      </div>

      <div
        className="touch-pan-y cursor-grab space-y-8 active:cursor-grabbing"
        aria-label="Drag the charts to rotate, or use the chart view buttons"
        onPointerDown={startRotationDrag}
        onPointerMove={continueRotationDrag}
        onPointerUp={finishRotationDrag}
        onPointerCancel={finishRotationDrag}
      >
        <RiverField
          measure={0}
          visibleIndex={fieldState.visibleIndex}
          perspective={fieldState.perspective}
          xRotationDegrees={xRotationDegrees}
          drawProgress={fieldState.drawProgress}
          handoffProgress={fieldState.handoffProgress}
          showAxes={showGuides}
          dark={dark}
        />
        {showWaterLevel && (
          <RiverField
            measure={1}
            visibleIndex={fieldState.visibleIndex}
            perspective={fieldState.perspective}
            xRotationDegrees={xRotationDegrees}
            drawProgress={fieldState.drawProgress}
            handoffProgress={fieldState.handoffProgress}
            showAxes={showGuides}
            dark={dark}
          />
        )}
      </div>

      {showGuides && (
        <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
          <span
            className="block h-1 w-full"
            style={{
              background: `linear-gradient(to right, ${rhinePalettes[dark ? 'dark' : 'light'].join(', ')})`
            }}
            aria-hidden="true"
          />
          <div className="mt-2 flex justify-between gap-2">
            <span>Below average</span>
            <span>Above average</span>
          </div>
          <div className="mt-1 text-center">Compared with the same time of year</div>
        </div>
      )}

      <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-800">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <Toggle
            label="Compare water level"
            checked={showWaterLevel}
            onChange={(event) => setShowWaterLevel(event.target.checked)}
            className="min-h-11"
          />
          <Toggle
            label="Axes and color key"
            checked={showGuides}
            onChange={(event) => setShowGuides(event.target.checked)}
            className="min-h-11"
          />
          <Select
            label="Speed"
            aria-label="Playback speed"
            value={playbackSpeed}
            onChange={(event) => {
              const speed = Number(event.target.value);
              speedRef.current = speed;
              setPlaybackSpeed(speed);
            }}
          >
            {playbackSpeeds.map((speed) => <option key={speed} value={speed}>{speed}×</option>)}
          </Select>
        </div>
        <div className="mt-3 space-y-1 text-xs text-gray-600 tabular-nums dark:text-gray-400">
          <div>{years[displayIndex].year} river flow: {summary[0]}</div>
          {showWaterLevel && <div>Water level: {summary[1]}</div>}
          {displayIndex === years.length - 1 && <div>Partial year through {lobithData.updatedThrough}</div>}
        </div>
      </div>
    </div>
  );
}

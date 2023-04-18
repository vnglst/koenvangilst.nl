'use client';

import React, { useCallback,useMemo } from 'react';
import { curveMonotoneX } from '@visx/curve';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { GridColumns,GridRows } from '@visx/grid';
import { ParentSize } from '@visx/responsive';
import { scaleLinear,scaleTime } from '@visx/scale';
import { AreaClosed, Bar,Line } from '@visx/shape';
import { defaultStyles,TooltipWithBounds, withTooltip } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { bisector,extent, max } from 'd3-array';
import { timeFormat } from 'd3-time-format';

type DataPoint = { created_at: string; count: number };
type TooltipData = DataPoint;

export const background = '#111827';
export const background2 = '#204051';
export const accentColor = '#bcecff';
export const accentColorDark = '#5bc3eb';

const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white'
};

// util
const formatDate = timeFormat("%b %d, '%y");

// accessors
const getDate = (d: DataPoint) => new Date(d.created_at);
const getValue = (d: DataPoint) => d.count;
const bisectDate = bisector<DataPoint, Date>(
  (d) => new Date(d.created_at)
).left;

export type AreaProps = {
  visits: DataPoint[];
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

const Visual = withTooltip<AreaProps, TooltipData>(
  ({
    visits,
    width,
    height,
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0
  }: AreaProps & WithTooltipProvidedProps<TooltipData>) => {
    if (width < 10) return null;

    // bounds
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // scales
    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left, innerWidth + margin.left],
          domain: extent(visits, getDate) as [Date, Date]
        }),
      [innerWidth, margin.left, visits]
    );

    const countValueScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight + margin.top, margin.top],
          domain: [0, (max(visits, getValue) || 0) + innerHeight / 3],
          nice: true
        }),
      [margin.top, innerHeight, visits]
    );

    // tooltip handler
    const handleTooltip = useCallback(
      (
        event:
          | React.TouchEvent<SVGRectElement>
          | React.MouseEvent<SVGRectElement>
      ) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = dateScale.invert(x);
        const index = bisectDate(visits, x0, 2);
        const d0 = visits[index - 1];
        const d1 = visits[index];
        let d = d0;
        if (d1 && getDate(d1)) {
          d =
            x0.valueOf() - getDate(d0).valueOf() >
            getDate(d1).valueOf() - x0.valueOf()
              ? d1
              : d0;
        }

        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: countValueScale(getValue(d))
        });
      },
      [showTooltip, countValueScale, dateScale, visits]
    );

    return (
      <div>
        <svg width={width} height={height}>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="url(#area-background-gradient)"
            rx={14}
          />
          <LinearGradient
            id="area-background-gradient"
            from={background}
            to={background2}
          />
          <LinearGradient
            id="area-gradient"
            from={accentColor}
            to={accentColor}
            toOpacity={0.1}
          />
          <GridRows
            left={margin.left}
            scale={countValueScale}
            width={innerWidth}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0}
            pointerEvents="none"
          />
          <GridColumns
            top={margin.top}
            scale={dateScale}
            height={innerHeight}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0.2}
            pointerEvents="none"
          />
          <AreaClosed<DataPoint>
            data={visits}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => countValueScale(getValue(d)) ?? 0}
            yScale={countValueScale}
            strokeWidth={1}
            stroke="url(#area-gradient)"
            fill="url(#area-gradient)"
            curve={curveMonotoneX}
          />
          <Bar
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                stroke={accentColorDark}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="5,2"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={accentColorDark}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            <TooltipWithBounds
              key={Math.random()}
              top={tooltipTop - 50}
              left={tooltipLeft}
              style={tooltipStyles}
            >
              {`Visits ${getValue(tooltipData)}`}
            </TooltipWithBounds>
            <TooltipWithBounds
              top={tooltipTop - 20}
              left={tooltipLeft}
              style={{
                ...defaultStyles,
                minWidth: 72,
                textAlign: 'center'
              }}
            >
              {formatDate(getDate(tooltipData))}
            </TooltipWithBounds>
          </div>
        )}
      </div>
    );
  }
);

type VisitsVisualProps = {
  visits?: DataPoint[];
};

export default function VisitsVisual({ visits }: VisitsVisualProps) {
  if (!visits) return null;

  return (
    <ParentSize>
      {({ width, height }) => (
        <Visual width={width} height={height} visits={visits} />
      )}
    </ParentSize>
  );
}

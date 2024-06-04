'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { hexbin as d3Hexbin } from 'd3-hexbin';

const theme = {
  textLight: '#f4f4f4',
  textDark: '#0c3d0c',
  bgLight: '#0c0c00',
  bgDark: '#000000'
};

const categories = [
  { name: 'Inland Water', percentage: 0.101461 + 0.000999, color: 'hsl(210, 58%, 71%)' },
  {
    name: 'Nature, Other',
    percentage: 0.135519 - 0.046588 - 0.038298 - 0.013264 - 0.00459,
    color: 'hsl(159, 27%, 63%)'
  },
  { name: 'Heath', percentage: 0.00459, color: 'hsl(159, 27%, 53%)' },
  { name: 'Other Grass', percentage: 0.013264, color: 'hsl(159, 27%, 43%)' },
  { name: 'Coniferous Forest', percentage: 0.038298, color: 'hsl(159, 27%, 43%)' },
  { name: 'Deciduous Forest', percentage: 0.046588, color: 'hsl(159, 27%, 33%)' },
  { name: 'Infrastructure', percentage: 0.052785 - 0.000548, color: 'hsl(0, 0%, 79%)' },
  { name: 'Solar Parks', percentage: 0.000548, color: 'hsl(51, 100%, 80%)' },
  {
    name: 'Urban Area, Other',
    percentage: 0.166386 - 0.067443 - 0.026991 - 0.006573 - 0.02495,
    color: 'hsl(345, 43%, 73%)'
  },
  { name: 'Buildings', percentage: 0.006573 + 0.02495, color: 'hsl(345, 43%, 63%)' },
  { name: 'Grass in Built-up Area', percentage: 0.067443 + 0.026991, color: 'hsl(345, 43%, 83%)' },
  {
    name: 'Agriculture, Other',
    percentage: 0.543848 - 0.283128 - 0.05711 - 0.04463 - 0.006692 - 0.008295 - 0.003513 - 0.043472,
    color: 'hsl(51, 100%, 90%)'
  },
  { name: 'Cereals', percentage: 0.043472, color: 'hsl(51, 100%, 85%)' },
  { name: 'Greenhouses', percentage: 0.003513, color: 'hsl(51, 100%, 80%)' },
  { name: 'Flower Bulbs', percentage: 0.008295, color: 'hsl(51, 100%, 75%)' },
  { name: 'Fruit', percentage: 0.006692, color: 'hsl(51, 100%, 70%)' },
  { name: 'Potatoes', percentage: 0.04463, color: 'hsl(51, 100%, 60%)' },
  { name: 'Corn', percentage: 0.05711, color: 'hsl(51, 100%, 50%)' },
  { name: 'Agricultural Grass', percentage: 0.283128, color: 'hsl(51, 100%, 40%)' }
];

const labels = [
  { label: 'Inland Water', displayLabel: true, labelTarget: { x: 660, y: 100 }, labelPosition: { x: 680, y: 50 } },
  { label: 'Nature', displayLabel: true, labelTarget: { x: 700, y: 200 }, labelPosition: { x: 730, y: 200 } },
  { label: 'Urban Area', displayLabel: true, labelTarget: { x: 650, y: 320 }, labelPosition: { x: 680, y: 320 } },
  { label: 'Agriculture', displayLabel: true, labelTarget: { x: 535, y: 540 }, labelPosition: { x: 600, y: 540 } }
];

const width = 800;
const height = 800;
const hexRadius = 7;

export const LandUseChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const projection = d3
      .geoMercator()
      .center([5.5, 52.2])
      .scale(9000)
      .translate([width / 2, height / 2]);

    d3.json('/static/json/netherlands.json')
      .then((geoData) => {
        const svg = d3.select(svgRef.current);
        const hexbin = d3Hexbin()
          .radius(hexRadius)
          .extent([
            [0, 0],
            [width, height]
          ]);

        const hexCenters: number[][] = [];
        for (let y = hexRadius; y < height; y += hexRadius * 1.5) {
          for (let x = hexRadius; x < width; x += hexRadius * Math.sqrt(3)) {
            hexCenters.push([x, y]);
          }
        }

        const netherlandsFeature = geoData.features[0];
        const hexPoints = hexCenters.filter((center) => d3.geoContains(netherlandsFeature, projection.invert(center)));
        const hexData = hexbin(hexPoints);

        const totalHexagons = hexData.length;
        const colorScale = d3
          .scaleOrdinal()
          .domain(categories.map((c) => c.name))
          .range(categories.map((c) => c.color));

        let hexColors: string[] = [];

        categories.forEach((category) => {
          const hexagonsPerCategory = Math.round(totalHexagons * category.percentage);
          for (let i = 0; i < hexagonsPerCategory; i++) hexColors.push(category.name);
        });

        let selectedCategory: string | null = null;

        function highlightHexagons(category) {
          svg
            .selectAll('.hexagon')
            .filter((_, i) => hexColors[i] === category)
            .attr('stroke-width', 1)
            .attr('stroke', theme.bgLight);
          svg
            .selectAll('.legend-item')
            .filter((_, i) => categories[i].name !== category)
            .attr('opacity', 0.4);
          svg
            .selectAll('.legend-item')
            .filter((_, i) => categories[i].name === category)
            .attr('opacity', 1);
        }

        function deselectHexagons() {
          svg.selectAll('.hexagon').attr('stroke-width', 0.1).attr('stroke', theme.bgLight);
          svg.selectAll('.legend-item').attr('opacity', 1);
          selectedCategory = null;
        }

        svg
          .append('g')
          .selectAll('path')
          .data(hexData)
          .enter()
          .append('path')
          .attr('class', 'hexagon')
          .attr('d', () => hexbin.hexagon(0))
          .attr('transform', (d) => `translate(${d.x},${d.y - Math.random() * 200})`)
          .attr('fill', theme.bgLight)
          .attr('stroke', theme.bgLight)
          .attr('stroke-width', 0.1)
          .on('mouseenter', function (event, d) {
            const category = hexColors[hexData.indexOf(d)];
            highlightHexagons(category);
          })
          .on('mouseleave', function () {
            if (!selectedCategory) {
              deselectHexagons();
            }
          })
          .on('click', function (event, d) {
            const category = hexColors[hexData.indexOf(d)];
            if (selectedCategory === category) {
              deselectHexagons();
            } else {
              deselectHexagons();
              highlightHexagons(category);
              selectedCategory = category;
            }
            event.stopPropagation();
            event.preventDefault();
          })
          .transition()
          .delay((_, i) => i * 0.7)
          .duration(750)
          .ease(d3.easeCubicOut)
          .attr('fill', (_, i) => colorScale(hexColors[i]))
          .attr('transform', (d) => `translate(${d.x},${d.y})`)
          .attr('d', (_) => hexbin.hexagon(hexRadius));

        d3.select('body').on('click', function () {
          if (selectedCategory !== null) {
            deselectHexagons();
          }
        });

        const legend = svg.append('g').attr('transform', `translate(5, 5)`);

        categories.forEach((category, i) => {
          const legendItem = legend
            .append('g')
            .attr('transform', `translate(0, ${i * 20})`)
            .attr('class', `legend-item ${category.name.replace(/\s+/g, '-')}`);

          legendItem
            .append('path')
            .attr('d', hexbin.hexagon(hexRadius))
            .attr('transform', 'translate(5,5)')
            .style('fill', category.color)
            .attr('opacity', 0)
            .transition()
            .delay(i * 40)
            .duration(500)
            .attr('opacity', 1);

          legendItem
            .append('text')
            .attr('x', 20)
            .attr('y', 10)
            .text(`${category.name}, ${(category.percentage * 100).toFixed(2)}%`)
            .attr('font-size', '14px')
            .attr('fill', 'currentColor')
            .attr('opacity', 0)
            .transition()
            .delay(i * 40)
            .duration(500)
            .attr('opacity', 1);
        });

        labels
          .filter((c) => c.displayLabel)
          .forEach((category, i) => {
            const labelGroup = svg;

            labelGroup
              .append('text')
              .attr('x', category.labelPosition.x)
              .attr('y', category.labelPosition.y)
              .text(category.label)
              .attr('font-size', '18px')
              .attr('font-weight', 'bold')
              .attr('fill', 'currentColor')
              .attr('opacity', 0)
              .transition()
              .delay(totalHexagons * 0.7 + 750 + i * 300)
              .duration(500)
              .attr('opacity', 1);

            labelGroup
              .append('line')
              .attr('x1', category.labelPosition.x - 10)
              .attr('y1', category.labelPosition.y - 5)
              .attr('x2', category.labelTarget.x - 10)
              .attr('y2', category.labelTarget.y - 5)
              .attr('stroke', 'currentColor')
              .attr('stroke-width', 2)
              .attr('stroke-dasharray', '2,2')
              .attr('opacity', 0)
              .transition()
              .delay(totalHexagons * 0.7 + 750 + i * 300)
              .duration(500)
              .attr('opacity', 1);

            labelGroup
              .append('circle')
              .attr('cx', category.labelPosition.x - 10)
              .attr('cy', category.labelPosition.y - 5)
              .attr('r', 3)
              .attr('fill', 'currentColor')
              .attr('opacity', 0)
              .transition()
              .delay(totalHexagons * 0.7 + 750 + i * 300)
              .duration(500)
              .attr('opacity', 1);

            labelGroup
              .append('circle')
              .attr('cx', category.labelTarget.x - 10)
              .attr('cy', category.labelTarget.y - 5)
              .attr('r', 3)
              .attr('fill', 'currentColor')
              .attr('opacity', 0)
              .transition()
              .delay(totalHexagons * 0.7 + 750 + i * 300)
              .duration(500)
              .attr('opacity', 1);
          });

        svg
          .append('foreignObject')
          .attr('x', 25)
          .attr('y', height - 50)
          .attr('width', 760)
          .attr('height', 30)
          .attr('font-size', '12px')
          .append('xhtml:div')
          .html(
            `Data: <a target="_blank" href="https://www.wur.nl/nl/onderzoek-resultaten/onderzoeksinstituten/environmental-research/faciliteiten-producten/kaarten-en-gis-bestanden/landelijk-grondgebruik-nederland.htm" class="text-gray-300 underline underline-offset-2">WUR</a>`
          );

        svg
          .append('foreignObject')
          .attr('x', 90)
          .attr('y', height - 50)
          .attr('width', 760)
          .attr('height', 30)
          .attr('font-size', '12px')
          .append('xhtml:div')
          .html(
            `| Code: <a target="_blank" href="https://github.com/vnglst/onsland" class="text-gray-300 underline underline-offset-2">Github</a>`
          );

        svg
          .append('foreignObject')
          .attr('x', 25)
          .attr('y', height - 30)
          .attr('width', 760)
          .attr('height', 30)
          .attr('font-size', '12px')
          .append('xhtml:div')
          .html(
            `Visualisation by <a target="_blank" href="https://koenvangilst.nl" class="text-gray-300 underline underline-offset-2">Koen van Gilst</a>`
          );
      })
      .catch((error) => console.error('Error loading or processing data:', error));
  }, []);

  return (
    <div className="lg:full-bleed from-bg-gray-900 flex flex-col items-center justify-center rounded-md bg-gradient-to-b from-black to-[#181500] p-5 text-gray-200">
      <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid"></svg>
    </div>
  );
};

import { Suspense } from 'react';

import { Container } from 'components/Container';
import ExternalLink from 'components/ExternalLink';
import { Heading } from 'components/Heading';
import { Prose } from 'components/Prose';

import { LandUseChart } from './LandUseChart';

export default function Page() {
  return (
    <Container centered>
      <Heading level={1} className="my-8">
        Land Use in The Netherlands
      </Heading>
      <Suspense fallback={<div className="h-[800px] w-full bg-gradient-to-b from-black to-[#181500]" />}>
        <LandUseChart />
      </Suspense>
      <Prose className="mt-8">
        <p>
          This webpage uses hexagons to visualize land use across the Netherlands. Each hexagon represents a tiny
          fraction of the country's land, roughly 0.06% or 26.647 hectares. The color of each hexagon corresponds to a
          specific type of land use.
        </p>
        <p>
          The Netherlands is one of the most densely populated countries in the world and as such it faces a constant
          challenge: balancing competing demands for its limited land. With a growing population, can we ensure there's
          space for affordable housing, nature, and productive agriculture? This visualization sheds light on how the
          Netherlands currently uses its land, which I hope can lead to a fact-based discussion: how can we optimize
          land use for a sustainable future?
        </p>
        <Heading level={2}>Data sources</Heading>
        <p>
          The data used in this visualization is from the{' '}
          <ExternalLink href="https://www.wur.nl/nl/onderzoek-resultaten/onderzoeksinstituten/environmental-research/faciliteiten-producten/kaarten-en-gis-bestanden/landelijk-grondgebruik-nederland.htm">
            Wageningen Environmental Research
          </ExternalLink>
          .
        </p>
        <Heading level={2}>Technology used</Heading>
        <p>
          This visualisation is made with <ExternalLink href="https://d3js.org/">D3.js</ExternalLink>. The source code
          of this visualization can be found in my website repository. For a simplified version using just an index.html
          file, see the link in the visualisation.
        </p>
      </Prose>
    </Container>
  );
}

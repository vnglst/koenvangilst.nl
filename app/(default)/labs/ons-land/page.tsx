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
      <Suspense fallback={<div className="h-[800px] w-full bg-gradient-to-b from-black to-[#02071d]" />}>
        <LandUseChart />
      </Suspense>
      <Prose className="mt-8">
        <p>
          This webpage uses hexagons to visualize land use across the Netherlands. Each hexagon represents a small
          fraction of the country's land, roughly 0.06% or 26.647 hectares. The color of each hexagon corresponds to a
          specific type of land use.
        </p>
        <p>
          The Netherlands is one of the most densely populated countries in the world, facing a constant challenge:
          balancing competing demands for its limited land. Despite concerns about space, the Netherlands has{' '}
          <ExternalLink href="https://decorrespondent.nl/14856/goed-nieuws-de-groene-transitie-gaat-in-nederland-keihard-nu-de-rest-van-de-wereld-nog/5e12fe2f-d0a7-07ac-392a-393f6048c80e#:~:text=Geen%20enkel%20EU%2Dland%20wekt,zonnepanelen%20opgesteld%20dan%20heel%20Afrika.">
            more solar panels
          </ExternalLink>{' '}
          than the entire continent of Africa. Yet, solar parks occupy only one hexagon on the entire map.
        </p>
        <p>
          With growing pressure on space, how can we ensure there's room for affordable housing, nature, and productive
          agriculture? This visualization sheds light on how the Netherlands currently uses its land, sparking a
          fact-based discussion on optimizing land use for a sustainable future.
        </p>
        <Heading level={2}>Technology</Heading>
        <p>
          This visualisation is made with <ExternalLink href="https://d3js.org/">D3.js</ExternalLink>. The source code
          of this visualization can be found in my website repository. For a simplified version using just an index.html
          file, see the link in the visualisation. The data is from the{' '}
          <ExternalLink href="https://www.wur.nl/nl/onderzoek-resultaten/onderzoeksinstituten/environmental-research/faciliteiten-producten/kaarten-en-gis-bestanden/landelijk-grondgebruik-nederland.htm">
            Wageningen Environmental Research.
          </ExternalLink>
        </p>
      </Prose>
    </Container>
  );
}

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
      <Suspense fallback={null}>
        <LandUseChart />
      </Suspense>
      <Prose className="mt-8">
        <p>
          This webpage visualizes land use in the Netherlands. Each hexagon represents 0.06% (26.647 hectares) of land
          of the Netherlands. The color of the hexagon indicates the type of land use.
        </p>
        <p>
          The Netherlands is one of the most densely populated countries in the world. This is also reflected in a lot
          of (political) discussion: with our limited space, do can we still build affordable houses, is there still a
          place for nature and farming if our population keeps growing? The Netherland currently has{' '}
          <ExternalLink href="https://decorrespondent.nl/14856/goed-nieuws-de-groene-transitie-gaat-in-nederland-keihard-nu-de-rest-van-de-wereld-nog/5e12fe2f-d0a7-07ac-392a-393f6048c80e#:~:text=Geen%20enkel%20EU%2Dland%20wekt,zonnepanelen%20opgesteld%20dan%20heel%20Afrika.">
            more solar panels
          </ExternalLink>{' '}
          than the whole of Africa combined. I hope this visualization can help to have a more fact-based discussion.
          Yes, every hectare is spoken for, but how we use it is up to us.
        </p>
        <Heading level={2}>Data sources</Heading>
        <Heading level={2}>Technology used</Heading>
      </Prose>
    </Container>
  );
}

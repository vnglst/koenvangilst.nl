import { Suspense } from 'react';
import dynamic from 'next/dynamic';

import { ArticleMetadata } from 'components/content/ArticleMetadata';
import { Heading } from 'components/content/Heading';
import { Disclaimer } from 'components/content/MDXComponent';
import { Prose } from 'components/content/Prose';
import { Container } from 'components/layout/Container';
import { Link } from 'components/ui/Link';

const LandUseChart = dynamic(() => import('./LandUseChart').then((mod) => mod.LandUseChart), {
  loading: () => <div className="h-[800px] w-full bg-gradient-to-b from-black to-[#02071d]" />
});

export const metadata = {
  title: 'Ons Land',
  description: ' A data visualization project that shows the distribution land use in the Netherlands.'
};

export default function Page() {
  return (
    <Container>
      <Heading level={1}>Land Use in The Netherlands</Heading>
      <ArticleMetadata publishedAt="06-05-2024" readingTimeText="1 minute" />
      <Suspense fallback={<div className="h-[800px] w-full bg-gradient-to-b from-black to-[#02071d]" />}>
        <LandUseChart />
      </Suspense>
      <Prose className="my-8">
        <p>
          This webpage uses hexagons to visualize land use across the Netherlands. Each hexagon represents a small
          fraction of the country's land, roughly 0.06% or 26.647 hectares. The color of each hexagon corresponds to a
          specific type of land use.
        </p>
        <p>
          The Netherlands is one of the most densely populated countries in the world, facing a constant challenge:
          balancing competing demands for its limited land. Despite concerns about space, the Netherlands has{' '}
          <Link href="https://decorrespondent.nl/14856/goed-nieuws-de-groene-transitie-gaat-in-nederland-keihard-nu-de-rest-van-de-wereld-nog/5e12fe2f-d0a7-07ac-392a-393f6048c80e#:~:text=Geen%20enkel%20EU%2Dland%20wekt,zonnepanelen%20opgesteld%20dan%20heel%20Afrika.">
            more solar panels
          </Link>{' '}
          than the entire continent of Africa. Yet, solar parks occupy only one hexagon on the entire map.
        </p>
        <p>
          With growing pressure on space, how can we ensure there's room for affordable housing, nature, and productive
          agriculture? This visualization sheds light on how the Netherlands currently uses its land, sparking a
          fact-based discussion on optimizing land use for a sustainable future.
        </p>
        <Heading level={2}>Technology</Heading>
        <p>
          This visualisation is made with <Link href="https://d3js.org/">D3.js</Link>. The source code of this
          visualization can be found in my website repository. For a simplified version using just an index.html file,
          see the link in the visualisation. The data is from the{' '}
          <Link href="https://research.wur.nl/en/publications/landelijk-grondgebruiksbestand-nederland-2021-lgn2021-achtergrond">
            Wageningen Environmental Research.
          </Link>
        </p>

        <Disclaimer>
          This visualization reached the Hacker News front page on June 8, 2024. If you're interested be sure to{' '}
          <Link href="https://news.ycombinator.com/item?id=40599763">head over to the discussion</Link>.
        </Disclaimer>
      </Prose>
    </Container>
  );
}

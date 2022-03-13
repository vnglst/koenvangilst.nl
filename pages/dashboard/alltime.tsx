import ParentSize from '@visx/responsive/lib/components/ParentSize';
import Container from 'components/Container';
import ExternalLink from 'components/ExternalLink';
import VisitsVisual from 'components/VisitsVisual';
import fetcher from 'lib/fetcher';
import useSWR from 'swr';

type Visit = {
  created_at: string;
  count: number;
};

export default function TodaysVisits() {
  const { data } = useSWR<Visit[]>('/api/views/perday', fetcher);

  return (
    <Container
      title="All time visits – Koen van Gilst"
      description="Visual showing the all time visits for my website."
    >
      <article className="flex flex-col justify-center items-start max-w-4xl mx-auto mb-16 w-full overflow-hidden">
        <div className="mb-4 w-full max-w-2xl mx-auto">
          <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">
            Alltime Visits Graph
          </h1>
        </div>
        <div className="w-full max-w-full h-[50vh]">
          {data ? (
            <ParentSize>
              {({ width, height }) => (
                <VisitsVisual width={width} height={height} data={data} />
              )}
            </ParentSize>
          ) : null}
        </div>
        <p className="w-full max-w-2xl mx-auto my-10 tracking-tight text-gray-700 dark:text-gray-400">
          This is a visual showing the all time visits for my website. It was
          created using the AirBnB visualizations library{' '}
          <ExternalLink href="https://airbnb.io/visx/areas">
            <b>VisX</b>
          </ExternalLink>
          . The data is fetched from a Supabase endpoint with a custom analytics
          implementation found in the NextJS middleware.
        </p>
      </article>
    </Container>
  );
}

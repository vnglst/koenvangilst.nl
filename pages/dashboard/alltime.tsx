import ParentSize from '@visx/responsive/lib/components/ParentSize';
import Container from 'components/Container';
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
    <Container title="Today – Koen van Gilst" description="ddddd">
      <article className="flex flex-col justify-center items-start max-w-4xl mx-auto mb-16 w-full">
        <div className="mb-4">
          <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">
            All visits
          </h1>
        </div>
        <div className="w-full h-[50vh]">
          {data ? (
            <ParentSize>
              {({ width, height }) => (
                <VisitsVisual width={width} height={height} data={data} />
              )}
            </ParentSize>
          ) : null}
        </div>
      </article>
    </Container>
  );
}

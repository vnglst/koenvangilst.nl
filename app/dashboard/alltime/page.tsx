import { Suspense } from 'react';

import { VisitsVisual } from 'components/VisitsVisual';
import { getViewsPerDay } from 'services/supabase';
import { View } from 'services/types';
import { Heading } from 'ui/Heading';

export const revalidate = 60 * 60;

export const metadata = {
  title: 'All time visits',
  description: 'Visual showing the all time visits for my website.'
};

export default async function TodaysVisits() {
  const visits = getViewsPerDay(365);

  return (
    <article className="mx-auto mb-16 flex w-full max-w-4xl flex-col items-start justify-center overflow-hidden text-black dark:text-white">
      <div className="mx-auto mb-4 w-full max-w-2xl">
        <Heading level={1}>Visitor Stats</Heading>
      </div>
      <div className="aspect-video min-h-[80vh] w-full overflow-hidden rounded-xl bg-[#111827] md:min-h-0">
        <Suspense>
          <VisualContainer visits={visits} />
        </Suspense>
      </div>
    </article>
  );
}

async function VisualContainer({ visits }: { visits: Promise<View[]> }) {
  const visitsNr = await visits;
  return <VisitsVisual visits={visitsNr} />;
}

import { api } from 'api/api.server';
import ExternalLink from 'components/ExternalLink';
import VisitsVisual from 'components/VisitsVisual';

export const metadata = {
  title: 'All time visits',
  description: 'Visual showing the all time visits for my website.'
};

type Visit = {
  created_at: string;
  count: number;
};

export default async function TodaysVisits() {
  const visits = await api.get<Visit[]>('api/views/perday', {
    next: { revalidate: 60 }
  });

  return (
    <article className="flex flex-col justify-center items-start max-w-4xl mx-auto mb-16 w-full overflow-hidden">
      <div className="mb-4 w-full max-w-2xl mx-auto">
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">
          Alltime Visits Graph
        </h1>
      </div>
      <div className="w-full max-w-full h-[50vh]">
        <VisitsVisual visits={visits} />
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
  );
}

function isLocalNetwork(hostname = window.location.host) {
  return (
    hostname.startsWith('localhost') ||
    hostname.startsWith('127.0.0.1') ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.0.') ||
    hostname.endsWith('.local')
  );
}

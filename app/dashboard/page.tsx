import GitHub from 'components/metrics/Github';
import Unsplash from 'components/metrics/Unsplash';
import Views from 'components/metrics/Views';

export const revalidate = 60 * 1;

export const metadata = {
  title: 'Dashboard',
  description:
    'My personal dashboard, built with Next.js API routes deployed as serverless functions.',
  alternates: {
    canonical: 'dashboard'
  }
};

export default function Dashboard() {
  return (
    <div className="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16">
      <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">
        Dashboard
      </h1>
      <div className="mb-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          This is my personal dashboard, built with Next.js API routes deployed
          as serverless functions. I use this dashboard to track various metrics
          across platforms like Unsplash and GitHub. It also shows daily, weekly
          & total view counts for my website.
        </p>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 my-2 w-full">
        <Unsplash />
        <GitHub />
        <Views />
      </div>
    </div>
  );
}

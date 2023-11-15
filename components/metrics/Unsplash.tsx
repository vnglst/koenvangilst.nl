import MetricCard from 'components/metrics/Card';
import { getUnsplashStatistics } from 'services/unsplash';

export default async function UnsplashCard() {
  const data = await getUnsplashStatistics();

  const downloads = Number(data?.downloads);
  const views = Number(data?.views);
  const link = 'https://unsplash.com/@vnglst';

  return (
    <>
      <MetricCard header="Unsplash Downloads" link={link} metric={downloads} />
      <MetricCard header="Unsplash Views" link={link} metric={views} />
    </>
  );
}

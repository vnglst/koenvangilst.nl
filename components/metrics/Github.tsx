import MetricCard from 'components/metrics/Card';
import { getGithubStats } from 'services/github';

export default async function GitHubCard() {
  const data = await getGithubStats();

  const stars = Number(data?.stars);
  const link = 'https://github.com/vnglst';

  return <MetricCard header="GitHub Stars" link={link} metric={stars} />;
}

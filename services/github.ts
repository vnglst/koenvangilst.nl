import { GitHub } from 'services/types';

const USER_STATS = 'https://api.github.com/users/vnglst';
const REPO_STATS = 'https://api.github.com/users/vnglst/repos?per_page=100';

export async function getGithubStats(): Promise<GitHub> {
  try {
    const userResponse = await fetch(USER_STATS, {
      next: {
        revalidate: 60 * 60 * 24
      }
    });

    const userReposResponse = await fetch(REPO_STATS, {
      next: {
        revalidate: 60 * 60 * 24
      }
    });

    const user = await userResponse.json();
    const repositories = await userReposResponse.json();

    const mine = repositories.filter((repo) => !repo.fork);
    const stars = mine.reduce((acc, repo) => acc + repo['stargazers_count'], 0);

    return {
      followers: user.followers,
      stars
    };
  } catch (error) {
    console.error('Error fetching Github stats', error);
    return {};
  }
}

import { GitHub } from 'services/types';

const USER_STATS = 'https://api.github.com/users/vnglst';
const REPO_STATS = 'https://api.github.com/users/vnglst/repos?per_page=100';
const NEXT_CACHING = { revalidate: 24 * 60 * 60 };

export async function getGithubStats(): Promise<GitHub> {
  try {
    const userResponse = await fetch(USER_STATS, { next: NEXT_CACHING });
    const userReposResponse = await fetch(REPO_STATS, { next: NEXT_CACHING });

    const user = await userResponse.json();
    const repositories = await userReposResponse.json();

    const mine = repositories.filter((repo) => !repo.fork);
    const stars = mine.reduce((acc, repo) => acc + repo['stargazers_count'], 0);

    return {
      followers: user.followers,
      stars
    };
  } catch (error) {
    console.log('Error fetching Github stats', error);
    return {};
  }
}

// `server-only` guarantees any modules that import code in file
// will never run on the client. Even though this particular api
// doesn't currently use sensitive environment variables, it's
// good practise to add `server-only` preemptively.
import 'server-only';

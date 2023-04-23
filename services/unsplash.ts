import invariant from 'tiny-invariant';

import { Unsplash } from 'services/types';

const ACCESS_TOKEN = process.env.UNSPLASH_ACCESS_KEY;
const STATIS_URL = 'https://api.unsplash.com/users/vnglst/statistics';
const HEADERS = { Authorization: `Client-ID ${ACCESS_TOKEN}` };
const REVALIDATE = 24 * 60 * 60; // 24 hours

/**
 * Retrieves the Unsplash statistics for user vnglst.
 */
export async function getUnsplashStatistics(): Promise<Unsplash> {
  try {
    const response = await fetch(STATIS_URL, {
      headers: HEADERS,
      method: 'GET',
      next: {
        revalidate: REVALIDATE
      }
    });

    invariant(response.status === 200, 'Error retrieving Unsplash statistics');
    invariant(response.ok, 'Error retrieving Unsplash statistics');

    const json = await response.json();

    return {
      downloads: json.downloads.total,
      views: json.views.total
    };
  } catch (error) {
    console.error('Fetching Unsplash statistics failed', error);
    return {};
  }
}

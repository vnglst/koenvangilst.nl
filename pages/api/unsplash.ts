import type { NextApiRequest,NextApiResponse } from 'next/types';

const ACCESS_TOKEN = process.env.UNSPLASH_ACCESS_KEY;

export default async function unsplash(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await fetch(
    'https://api.unsplash.com/users/vnglst/statistics',
    {
      headers: {
        Authorization: `Client-ID ${ACCESS_TOKEN}`
      },
      method: 'GET'
    }
  );

  const unsplashdata = await response.json();

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1200, stale-while-revalidate=600'
  );

  return res.status(200).json({
    downloads: unsplashdata.downloads.total,
    views: unsplashdata.views.total
  });
}

import type { NextApiRequest, NextApiResponse } from 'next';
import Unsplash, { toJson } from 'unsplash-js';

let unsplash;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!unsplash) {
    unsplash = new Unsplash({
      accessKey: process.env.UNSPLASH_ACCESS_KEY
    });
  }

  const userStats = await unsplash.users.statistics('vnglst');
  const { downloads, views } = await toJson(userStats);

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1200, stale-while-revalidate=600'
  );

  return res.status(200).json({
    downloads: downloads.total,
    views: views.total
  });
}

import type { NextApiRequest, NextApiResponse } from 'next';
import invariant from 'tiny-invariant';

/**
 * Retrieves the view count for a given pathname.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    invariant(
      typeof req.query.pathname === 'string',
      'slug is required and should be string'
    );

    const pathname = encodeURIComponent(req.query.pathname);

    const request = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/totals?pathname=eq.${pathname}`,
      {
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        method: 'GET'
      }
    );

    invariant(request.status === 200, 'Error retrieving view');

    const json = await request.json();
    const views = json.length > 0 ? json[0].total : 0;

    return res.status(200).send({ views });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
}

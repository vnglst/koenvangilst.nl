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
    const request = await fetch(`${process.env.SUPABASE_URL}/rest/v1/perday`, {
      headers: {
        apikey: process.env.SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      method: 'GET'
    });

    invariant(request.status === 200, 'Error retrieving view');

    const json = await request.json();

    return res.status(200).send(json);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
}

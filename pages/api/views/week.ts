import type { NextApiRequest, NextApiResponse } from 'next';

type View = { pathname: string; count: number };

/**
 * Retrieves the view count for this week
 */
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const request = await fetch(`${process.env.SUPABASE_URL}/rest/v1/week`, {
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    },
    method: 'GET'
  });

  const list: View[] = await request.json();
  const totals = list.reduce((prev, item) => prev + item.count, 0);
  return res.status(200).send(totals);
}

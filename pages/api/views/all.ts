import type { NextApiRequest, NextApiResponse } from 'next';

type View = { pathname: string; total: number };

/**
 * Retrieves the total view count (all time)
 */
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const request = await fetch(`${process.env.SUPABASE_URL}/rest/v1/totals`, {
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    },
    method: 'GET'
  });

  const list: View[] = await request.json();
  const totals = list.reduce((prev, item) => prev + item.total, 0);
  return res.status(200).send(totals);
}

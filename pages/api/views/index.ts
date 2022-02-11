import type { NextApiRequest, NextApiResponse } from 'next';
import invariant from 'tiny-invariant';

/**
 * Call this endpoint to track a page view.
 * No body required, all data is parsed
 * from the request.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    invariant(req.headers.referer, 'referer is required');

    const url = new URL(req.headers.referer);

    const body = JSON.stringify({
      pathname: url.pathname,
      origin: url.origin,
      ua: req.headers['user-agent']
    });

    const request = await fetch(`${process.env.SUPABASE_URL}/rest/v1/visits`, {
      headers: {
        apikey: process.env.SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body,
      method: 'POST'
    });

    invariant(request.status === 201, 'Error logging analytics');

    // all good, view tracked
    return res.status(201).send('');
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

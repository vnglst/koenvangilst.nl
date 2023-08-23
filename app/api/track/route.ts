import { trackView } from 'services/supabase';

export async function POST(request: Request) {
  const body = await request.json();

  await trackView({
    origin: body.origin,
    pathname: body.pathname,
    ua: request.headers.get('user-agent')
  });

  return new Response(null, { status: 204 });
}

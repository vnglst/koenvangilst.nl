import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const headersList = headers();
  const referer = headersList.get('referer');
  const redirectUrl = new URL(referer || '/').toString();

  return new Response(null, {
    headers: {
      'Set-Cookie': `mode=${formData.get('nextMode')}`,
      Location: redirectUrl
    },
    status: 302
  });
}

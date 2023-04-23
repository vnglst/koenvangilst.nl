import { NextResponse } from 'next/server';

import { getViews } from 'services/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pathname = searchParams.get('path');

  if (!pathname) {
    return new Response('Missing pathname', { status: 422 });
  }

  const views = await getViews(pathname);
  return NextResponse.json(views);
}

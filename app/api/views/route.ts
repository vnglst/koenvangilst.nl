import { NextResponse } from 'next/server';

import { supabase } from 'services/supabase.client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pathname = searchParams.get('path');

  if (!pathname) {
    return new Response('Missing pathname', { status: 422 });
  }

  const views = await getViews(pathname);
  return NextResponse.json(views);
}

/**
 * Retrieves the view count for a given pathname.
 */
async function getViews(pathnameRaw: string): Promise<number> {
  const { data: views, error } = await supabase.from('totals').select('total').eq('pathname', pathnameRaw);

  if (error) {
    console.error('Fetching views failed', error);
    return 0;
  }

  if (!views[0]) {
    return 0;
  }

  return views[0].total;
}

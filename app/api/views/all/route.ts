import { NextResponse } from 'next/server';

import { getTotalViews } from 'services/supabase';

export async function GET() {
  const views = await getTotalViews();
  return NextResponse.json(views);
}

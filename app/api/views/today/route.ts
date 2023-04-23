import { NextResponse } from 'next/server';

import { getTotalTodayViews } from 'services/supabase';

export async function GET() {
  const views = await getTotalTodayViews();
  return NextResponse.json(views);
}

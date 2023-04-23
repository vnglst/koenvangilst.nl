import { NextResponse } from 'next/server';
import { getTotalWeekViews } from 'services/supabase';

export async function GET() {
  const views = await getTotalWeekViews();
  return NextResponse.json(views);
}

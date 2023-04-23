import { NextResponse } from 'next/server';
import { getUnsplashStatistics } from 'services/unsplash';

export async function GET() {
  const stats = await getUnsplashStatistics();
  return NextResponse.json(stats);
}

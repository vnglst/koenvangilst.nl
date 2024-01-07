import { unstable_noStore } from 'next/cache';
import { NextResponse } from 'next/server';

import { getLastReading } from 'services/aranet';

export async function GET() {
  // Disable Next.js response caching
  // TODO: Do I really need to do this?
  unstable_noStore();
  const reading = await getLastReading();
  return NextResponse.json(reading);
}

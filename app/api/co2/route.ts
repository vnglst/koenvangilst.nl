import { NextResponse } from 'next/server';

import { getLastReading } from 'services/aranet';

export async function GET() {
  const reading = await getLastReading();
  return NextResponse.json(reading);
}

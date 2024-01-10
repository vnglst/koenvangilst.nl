import { NextResponse } from 'next/server';

import { getLastReading } from 'services/aranet';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const reading = await getLastReading();
    return NextResponse.json(reading);
  } catch (error) {
    console.error('An error occured', error);
    return new Response('An error occured', { status: 500 });
  }
}

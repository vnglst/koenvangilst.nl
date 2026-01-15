import { NextRequest, NextResponse } from 'next/server';

const PLAUSIBLE_BASE_URL = 'https://plausible.koenvangilst.nl';
const PLAUSIBLE_SITE_ID = 'koenvangilst.nl';

type TimePeriod = '7d' | '30d' | '12mo' | '6mo';

interface TimeseriesDataPoint {
  date: string;
  visitors: number;
  pageviews: number;
}

/**
 * Fetch timeseries data from Plausible Analytics for charts
 * API route to proxy requests to Plausible Stats API
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = (searchParams.get('period') || '30d') as TimePeriod;

  const apiKey = process.env.PLAUSIBLE_API_KEY;

  if (!apiKey) {
    console.warn('PLAUSIBLE_API_KEY not configured');
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    // Fetch timeseries stats
    const params: Record<string, string> = {
      site_id: PLAUSIBLE_SITE_ID,
      period: period,
      metrics: 'visitors,pageviews'
    };

    const response = await fetch(
      `${PLAUSIBLE_BASE_URL}/api/v1/stats/timeseries?${new URLSearchParams(params)}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    if (!response.ok) {
      console.error('Plausible API error:', response.status, await response.text());
      return NextResponse.json({ error: 'Failed to fetch stats from Plausible' }, { status: response.status });
    }

    const data = await response.json();

    // Transform the response to a more convenient format
    const results: TimeseriesDataPoint[] = data.results.map((item: any) => ({
      date: item.date,
      visitors: item.visitors || 0,
      pageviews: item.pageviews || 0
    }));

    return NextResponse.json({
      period,
      results
    });
  } catch (error) {
    console.error('Error fetching Plausible stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

const PLAUSIBLE_BASE_URL = 'https://plausible.koenvangilst.nl';
const PLAUSIBLE_SITE_ID = 'koenvangilst.nl';

type TimePeriod = 'all' | 'year' | 'month' | 'week';

interface PageStat {
  page: string;
  visitors: number;
  pageviews: number;
}

/**
 * Fetch top pages from Plausible Analytics for different time periods
 * API route to proxy requests to Plausible Stats API
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = (searchParams.get('period') || 'all') as TimePeriod;
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const apiKey = process.env.PLAUSIBLE_API_KEY;

  if (!apiKey) {
    console.warn('PLAUSIBLE_API_KEY not configured');
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    // Determine date range based on period
    let periodParam: string;
    let dateParam: string | undefined;
    const today = new Date().toISOString().split('T')[0];

    switch (period) {
      case 'all':
        periodParam = 'custom';
        dateParam = `2010-01-01,${today}`; // All-time stats from site inception
        break;
      case 'year':
        periodParam = '12mo';
        dateParam = undefined;
        break;
      case 'month':
        periodParam = 'month';
        dateParam = undefined;
        break;
      case 'week':
        periodParam = '7d';
        dateParam = undefined;
        break;
      default:
        return NextResponse.json({ error: 'Invalid period' }, { status: 400 });
    }

    // Fetch breakdown stats for pages
    const params: Record<string, string> = {
      site_id: PLAUSIBLE_SITE_ID,
      period: periodParam,
      property: 'event:page',
      metrics: 'visitors,pageviews',
      limit: limit.toString()
    };

    if (dateParam) {
      params.date = dateParam;
    }

    const response = await fetch(
      `${PLAUSIBLE_BASE_URL}/api/v1/stats/breakdown?${new URLSearchParams(params)}`,
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
    const results: PageStat[] = data.results.map((item: any) => ({
      page: item.page,
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

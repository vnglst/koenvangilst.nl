import { NextRequest, NextResponse } from 'next/server';

const PLAUSIBLE_BASE_URL = 'https://plausible.koenvangilst.nl';
const PLAUSIBLE_SITE_ID = 'koenvangilst.nl';

interface AggregateStats {
  visitors: number;
  pageviews: number;
  bounce_rate: number;
  visit_duration: number;
}

/**
 * Fetch aggregate stats from Plausible Analytics
 * API route to proxy requests to Plausible Stats API
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '30d';

  const apiKey = process.env.PLAUSIBLE_API_KEY;

  if (!apiKey) {
    console.warn('PLAUSIBLE_API_KEY not configured');
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    let dateParam: string | undefined;
    const today = new Date().toISOString().split('T')[0];

    if (period === 'all') {
      dateParam = `2010-01-01,${today}`;
    }

    // Fetch aggregate stats
    const params: Record<string, string> = {
      site_id: PLAUSIBLE_SITE_ID,
      period: period === 'all' ? 'custom' : period,
      metrics: 'visitors,pageviews,bounce_rate,visit_duration'
    };

    if (dateParam) {
      params.date = dateParam;
    }

    const response = await fetch(
      `${PLAUSIBLE_BASE_URL}/api/v1/stats/aggregate?${new URLSearchParams(params)}`,
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

    const stats: AggregateStats = {
      visitors: data.results.visitors?.value || 0,
      pageviews: data.results.pageviews?.value || 0,
      bounce_rate: data.results.bounce_rate?.value || 0,
      visit_duration: data.results.visit_duration?.value || 0
    };

    return NextResponse.json({
      period,
      stats
    });
  } catch (error) {
    console.error('Error fetching Plausible stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

const PLAUSIBLE_BASE_URL = 'https://plausible.koenvangilst.nl';
const PLAUSIBLE_SITE_ID = 'koenvangilst.nl';

/**
 * Fetch page stats from Plausible Analytics
 * API route to proxy requests to Plausible Stats API
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page');

  if (!page) {
    return NextResponse.json({ error: 'Page parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.PLAUSIBLE_API_KEY;

  if (!apiKey) {
    console.warn('PLAUSIBLE_API_KEY not configured');
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    // Fetch aggregate stats for the specific page
    // Using custom date range from site start (2010-01-01) to today for all-time stats
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(
      `${PLAUSIBLE_BASE_URL}/api/v1/stats/aggregate?` +
        new URLSearchParams({
          site_id: PLAUSIBLE_SITE_ID,
          period: 'custom',
          date: `2010-01-01,${today}`, // All-time stats from site inception
          metrics: 'visitors,pageviews',
          filters: `event:page==${page}`
        }),
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

    return NextResponse.json({
      page,
      visitors: data.results.visitors.value || 0,
      pageviews: data.results.pageviews.value || 0
    });
  } catch (error) {
    console.error('Error fetching Plausible stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

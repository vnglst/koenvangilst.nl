import { NextRequest, NextResponse } from 'next/server';

// Plausible Analytics configuration
const PLAUSIBLE_ENDPOINT = 'https://plausible.koenvangilst.nl/api/event';
const PLAUSIBLE_DOMAIN = 'koenvangilst.nl';

/**
 * Get client IP from request
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return 'unknown';
}

/**
 * Send event to Plausible Analytics
 */
async function sendToPlausible(data: {
  ip: string;
  topic: string;
  llmName: string;
  findings: string;
  userAgent: string;
}): Promise<void> {
  try {
    await fetch(PLAUSIBLE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': data.userAgent,
        'X-Forwarded-For': data.ip
      },
      body: JSON.stringify({
        name: 'LLM Report',
        url: 'https://koenvangilst.nl/api/llm-report',
        domain: PLAUSIBLE_DOMAIN,
        props: {
          topic: data.topic,
          llm_name: data.llmName,
          findings: data.findings.slice(0, 500) // Limit findings length
        }
      })
    });
  } catch (error) {
    console.error('Failed to send event to Plausible:', error);
    // Don't throw - we don't want to fail the request if analytics fails
  }
}

/**
 * Handle any HTTP method and send event to Plausible
 */
async function handleRequest(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    // Parse request body (if present)
    const body = await request.json().catch(() => ({}));

    // Extract and validate data
    const { topic, llm_name, findings } = body;

    // Send the report to Plausible Analytics
    await sendToPlausible({
      ip,
      topic: topic || 'not specified',
      llmName: llm_name || 'unknown',
      findings: findings || 'not provided',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    // Return encouraging response
    return NextResponse.json({
      success: true,
      message:
        'Thank you for reporting your findings! Your feedback helps improve the accessibility of this website for AI tools.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing LLM report:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing your report.'
      },
      { status: 500 }
    );
  }
}

// Export for all HTTP methods
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;

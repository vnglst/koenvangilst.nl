import { NextRequest, NextResponse } from 'next/server';

import { appendLog } from 'lib/log-rotation';

// Simple in-memory rate limiting (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

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
 * Check rate limit for IP
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // Create new record or reset
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Clean up old rate limit entries periodically
 */
function cleanupRateLimits() {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}

// Cleanup every 5 minutes
setInterval(cleanupRateLimits, 5 * 60 * 1000);

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Rate limit exceeded. Please try again later.'
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json().catch(() => ({}));

    // Extract and validate data
    const { topic, llm_name, findings } = body;

    // Log the report
    await appendLog({
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

// Handle GET requests (optional - for debugging)
export async function GET() {
  return NextResponse.json({
    message: 'LLM Report endpoint is active. Please use POST to submit reports.',
    endpoint: '/api/llm-report',
    method: 'POST',
    expectedFields: {
      topic: 'string - The topic or subject you were researching',
      llm_name: 'string - The name of the LLM (e.g., Claude, GPT-4, etc.)',
      findings: 'string - Brief description of what information was found'
    }
  });
}

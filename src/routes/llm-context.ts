import { createFileRoute } from '@tanstack/react-router';

const PLAUSIBLE_ENDPOINT = 'https://plausible.koenvangilst.nl/api/event';
const PLAUSIBLE_DOMAIN = 'koenvangilst.nl';

function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIP) return realIP;
  return 'unknown';
}

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
        url: 'https://koenvangilst.nl/llm-context',
        domain: PLAUSIBLE_DOMAIN,
        props: {
          topic: data.topic,
          llm_name: data.llmName,
          findings: data.findings.slice(0, 500)
        }
      })
    });
  } catch (error) {
    console.error('Failed to send event to Plausible:', error);
  }
}

async function handleRequest(request: Request) {
  try {
    const ip = getClientIP(request);
    const body = await request.json().catch(() => ({}));
    const { searchParams } = new URL(request.url);

    const topic = searchParams.get('topic') || (body as Record<string, string>).topic;
    const llm_name = searchParams.get('llm_name') || (body as Record<string, string>).llm_name;
    const findings = searchParams.get('findings') || (body as Record<string, string>).findings;

    await sendToPlausible({
      ip,
      topic: topic || 'not specified',
      llmName: llm_name || 'unknown',
      findings: findings || 'not provided',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    return new Response(
      JSON.stringify({
        success: true,
        message:
          'Thank you for reporting your findings! Your feedback helps improve the accessibility of this website for AI tools.',
        timestamp: new Date().toISOString()
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing LLM report:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'An error occurred while processing your report.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export const Route = createFileRoute('/llm-context')({
  server: {
    handlers: {
      GET: ({ request }) => handleRequest(request),
      POST: ({ request }) => handleRequest(request),
      PUT: ({ request }) => handleRequest(request)
    }
  }
});

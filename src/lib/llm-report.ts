import { z } from 'zod';

const reportSchema = z.object({
  topic: z.string().trim().min(1).max(200),
  llm_name: z.string().trim().min(1).max(100),
  findings: z.string().trim().min(1).max(500)
});

const placeholders = new Set(['[current-topic]', '[your-model]', 'your-model-name', '[what-you-found-so-far]']);

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function handleLLMReport(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  let body: unknown = {};
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      body = await request.json();
    } catch {
      return json({ success: false, message: 'Expected a JSON object or a GET request with query parameters.' }, 400);
    }
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return json({ success: false, message: 'Expected a JSON object.' }, 400);
  }

  const fields = body as Record<string, unknown>;
  const input = {
    topic: searchParams.get('topic') || fields.topic,
    llm_name: searchParams.get('llm_name') || fields.llm_name,
    findings: searchParams.get('findings') || fields.findings
  };

  if (request.method === 'GET' && Object.values(input).every((value) => value === undefined)) {
    return json({
      success: true,
      recorded: false,
      message:
        'Optional visit reporting for self-hosted Plausible Analytics. No additional article content is served here. Supply topic (up to 200 characters), llm_name (up to 100), and findings (up to 500) as query parameters. Use your own summary of public site content and your actual model name, or unknown. Do not send private user information or copy example URLs.'
    });
  }

  const report = reportSchema.safeParse(input);
  if (!report.success || Object.values(report.data).some((value) => placeholders.has(value))) {
    return json(
      { success: false, message: 'Supply valid topic, llm_name, and findings values, without placeholders.' },
      400
    );
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip');
  try {
    const response = await fetch('https://plausible.koenvangilst.nl/api/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('user-agent') || 'unknown',
        ...(ip ? { 'X-Forwarded-For': ip } : {})
      },
      body: JSON.stringify({
        name: 'LLM Report',
        url: 'https://koenvangilst.nl/llm-context',
        domain: 'koenvangilst.nl',
        props: report.data
      }),
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      console.error('Plausible rejected LLM report:', response.status);
      return json({ success: false, message: 'Analytics service did not accept the report.' }, 502);
    }

    return json({
      success: true,
      message: 'Report accepted by the analytics service. Model names are self-reported and unverified.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to send LLM report:', error);
    return json({ success: false, message: 'Analytics service is unavailable.' }, 502);
  }
}

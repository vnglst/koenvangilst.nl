import { afterEach, describe, expect, it, vi } from 'vitest';

import { handleLLMReport } from './llm-report';

const report = {
  topic: 'Self-hosted website architecture',
  llm_name: 'Test assistant',
  findings: 'The site runs TanStack Start behind Nginx.'
};

function request(values = report) {
  return new Request(`https://koenvangilst.nl/llm-context?${new URLSearchParams(values)}`, {
    headers: { 'User-Agent': 'report-test', 'X-Forwarded-For': '203.0.113.1, 10.0.0.1' }
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('LLM reporting', () => {
  it('explains bare visits without recording them', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    const response = await handleLLMReport(new Request('https://koenvangilst.nl/llm-context'));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ recorded: false });
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('forwards original reports and requester attribution to Plausible', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    vi.stubGlobal('fetch', fetch);
    const response = await handleLLMReport(request());

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ success: true });
    expect(fetch).toHaveBeenCalledWith(
      'https://plausible.koenvangilst.nl/api/event',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'User-Agent': 'report-test', 'X-Forwarded-For': '203.0.113.1' }),
        body: JSON.stringify({
          name: 'LLM Report',
          url: 'https://koenvangilst.nl/llm-context',
          domain: 'koenvangilst.nl',
          props: report
        }),
        signal: expect.any(AbortSignal)
      })
    );
  });

  it.each(['POST', 'PUT'])('accepts %s JSON with query parameters taking precedence', async (method) => {
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    vi.stubGlobal('fetch', fetch);
    const response = await handleLLMReport(
      new Request('https://koenvangilst.nl/llm-context?topic=Creative+coding', {
        method,
        body: JSON.stringify(report),
        headers: { 'Content-Type': 'application/json' }
      })
    );

    expect(response.status).toBe(200);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ body: expect.stringContaining('"topic":"Creative coding"') })
    );
  });

  it.each([
    { ...report, topic: '[current-topic]' },
    { ...report, llm_name: '[your-model]' },
    { ...report, llm_name: 'your-model-name' },
    { ...report, findings: '[what-you-found-so-far]' },
    { ...report, findings: '' },
    { ...report, findings: 'x'.repeat(501) },
    { ...report, topic: 'x'.repeat(201) },
    { ...report, llm_name: 'x'.repeat(101) }
  ])('rejects incomplete, placeholder, or oversized reports: %j', async (values) => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);

    expect((await handleLLMReport(request(values))).status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each(['null', '[]', '{', JSON.stringify({ ...report, findings: { text: 'invalid' } })])(
    'rejects invalid JSON payloads without contacting Plausible: %s',
    async (body) => {
      const fetch = vi.fn();
      vi.stubGlobal('fetch', fetch);
      const response = await handleLLMReport(
        new Request('https://koenvangilst.nl/llm-context', { method: 'POST', body })
      );

      expect(response.status).toBe(400);
      expect(fetch).not.toHaveBeenCalled();
    }
  );

  it.each([400, 429, 500])('reports failure when Plausible returns %s', async (status) => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status })));
    const response = await handleLLMReport(request());

    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({ success: false });
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('reports network failures instead of success', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network unavailable')));
    const response = await handleLLMReport(request());

    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({ success: false });
  });
});

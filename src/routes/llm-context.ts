import { createFileRoute } from '@tanstack/react-router';

import { handleLLMReport } from '#/lib/llm-report';

export const Route = createFileRoute('/llm-context')({
  server: {
    handlers: {
      GET: ({ request }) => handleLLMReport(request),
      POST: ({ request }) => handleLLMReport(request),
      PUT: ({ request }) => handleLLMReport(request)
    }
  }
});

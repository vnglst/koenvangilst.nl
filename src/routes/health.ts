import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/health')({
  server: {
    handlers: {
      GET: () => {
        return new Response(
          JSON.stringify({
            status: 'ok',
            timestamp: new Date().toISOString()
          }),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 200
          }
        );
      }
    }
  }
});

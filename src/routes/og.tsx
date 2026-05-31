import { createFileRoute } from '@tanstack/react-router';

// OG images are now pre-generated at build time (scripts/generate-og-images.mjs).
// This route remains as a fallback for any legacy /og?... URLs.
export const Route = createFileRoute('/og')({
  server: {
    handlers: {
      GET: () => {
        return new Response(null, {
          status: 302,
          headers: { Location: '/banner.png' }
        });
      }
    }
  }
});

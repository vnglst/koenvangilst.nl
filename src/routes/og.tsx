import { createFileRoute } from '@tanstack/react-router';
import { createHomeOgImage } from '#/lib/og-image.mjs';

// Preserve legacy /og?... URLs while the generated images are served by Nginx.
export const Route = createFileRoute('/og')({
  server: {
    handlers: {
      GET: () => {
        return new Response(null, {
          status: 302,
          headers: { Location: createHomeOgImage().url }
        });
      }
    }
  }
});

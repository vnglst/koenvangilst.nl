import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server';
import { getLegacyRedirect } from '#/lib/legacy-redirect';

const handleRequest = createStartHandler(defaultStreamHandler);

// Nginx handles static assets, caching and headers in production. Redirects are
// also handled here so direct Node previews retain links in historical content.
export default {
  fetch(request: Request) {
    const redirect = getLegacyRedirect(new URL(request.url).pathname);
    if (redirect) return new Response(null, { status: redirect.status, headers: { Location: redirect.location } });
    return handleRequest(request);
  }
};

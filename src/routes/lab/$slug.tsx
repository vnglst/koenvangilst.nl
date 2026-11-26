import { createFileRoute, redirect } from '@tanstack/react-router';

import { getLegacyRedirect } from '#/lib/legacy-redirect';

// Articles moved from /lab/<slug> to /articles/<slug>. `src/server.ts` and Nginx redirect direct
// requests; this route covers client-side navigation from pages still open in a browser.
// The Lab's own projects have static routes, which take precedence over this one.
export const Route = createFileRoute('/lab/$slug')({
  beforeLoad: ({ location }) => {
    const target = getLegacyRedirect(location.pathname, location.searchStr);
    throw redirect({ href: target?.location ?? '/lab', statusCode: 301 });
  }
});

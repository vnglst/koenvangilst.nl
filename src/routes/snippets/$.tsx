import { legacySplatRedirect } from '#/lib/redirect';

export const Route = legacySplatRedirect('/snippets/$', (splat) =>
  ({ href: `/lab/${splat ?? ''}`, statusCode: 301 } as never)
);

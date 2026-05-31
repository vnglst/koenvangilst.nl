import { legacySplatRedirect } from '#/lib/redirect';

export const Route = legacySplatRedirect('/projects/$', (splat) =>
  ({ href: `/lab/${splat ?? ''}`, statusCode: 301 } as never)
);

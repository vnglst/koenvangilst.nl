import { redirect } from '@tanstack/react-router';
import { legacySplatRedirect } from '#/lib/redirect';

export const Route = legacySplatRedirect('/blog/$', (splat) => {
  if (splat === 'feed') throw redirect({ href: '/feed.xml', statusCode: 301 });
  return { href: `/lab/${splat ?? ''}`, statusCode: 301 } as never;
});

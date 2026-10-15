/** Keep server-rendered previews consistent with the production Nginx redirects. */
export function getLegacyRedirect(pathname: string): { location: string; status: 301 | 302 } | undefined {
  if (/^\/lab\/co2\/?$/.test(pathname)) return { location: '/lab/aranet4-co2-monitor', status: 301 };
  if (pathname === '/blog/feed') return { location: '/feed.xml', status: 301 };
  if (pathname.startsWith('/photography/photo/')) return { location: '/photography', status: 302 };
  const match = /^\/(blog|portfolio|clients|labs|snippets|projects)(?:\/(.*))?$/.exec(pathname);
  if (!match) return undefined;
  return { location: match[2] ? `/lab/${match[2]}` : '/lab', status: 301 };
}

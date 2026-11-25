type Redirect = { location: string; status: 301 | 302 };

/** Interactive projects that live in the Lab itself; every other old `/lab/<slug>` is an article. */
const LAB_PROJECTS = ['gen-art-gallery', 'ons-land', 'prognosis-2100'];

// Posts that only introduce an in-site project; send them straight to the project.
const PROJECT_POSTS: Record<string, string> = {
  'gen-art-gallery-project': '/lab/gen-art-gallery',
  'ons-land-project': '/lab/ons-land',
  'prognosis-2100-project': '/lab/prognosis-2100'
};

/** The current home of a slug from an old `/lab/`, `/blog/` or similar URL. */
function destination(slug: string) {
  if (slug === 'co2') return '/articles/aranet4-co2-monitor';
  if (LAB_PROJECTS.includes(slug)) return `/lab/${slug}`;
  return PROJECT_POSTS[slug] ?? `/articles/${slug}`;
}

/**
 * Keep server-rendered previews consistent with the production Nginx redirects in
 * `nginx/nginx.conf`. Every old URL reaches its current page in a single redirect.
 */
export function getLegacyRedirect(pathname: string, search = ''): Redirect | undefined {
  const permanent = (location: string): Redirect => ({ location: location + search, status: 301 });

  if (pathname === '/blog/feed') return { location: '/feed.xml', status: 301 };
  if (pathname.startsWith('/photography/photo/')) return { location: '/photography', status: 302 };

  // The Lab used to list articles and filter them by tag through `?q=`.
  if (pathname === '/lab' || pathname === '/lab/') {
    const q = new URLSearchParams(search).get('q');
    if (q === 'side-project') return { location: '/lab', status: 301 };
    if (q) return { location: `/articles?${new URLSearchParams({ q })}`, status: 301 };
    return undefined;
  }

  const lab = /^\/lab\/([^/]+)\/?$/.exec(pathname);
  if (lab) return LAB_PROJECTS.includes(lab[1]) ? undefined : permanent(destination(lab[1]));

  const section = /^\/(blog|labs|snippets|clients|portfolio|projects)(?:\/(.*))?$/.exec(pathname);
  if (!section) return undefined;
  const slug = section[2]?.replace(/\/$/, '');
  if (slug) return permanent(destination(slug));
  return permanent(['portfolio', 'projects'].includes(section[1]) ? '/lab' : '/articles');
}

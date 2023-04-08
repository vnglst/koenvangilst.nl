import { globby } from 'globby';

export default async function sitemap() {
  const allPages = await globby([
    'pages/*.tsx',
    'data/**/*.mdx',
    '!data/*.mdx',
    '!pages/_*.tsx',
    '!pages/api',
    '!pages/404.tsx'
  ]);

  const pages = allPages.map((page) => {
    const path = page
      .replace('pages', '')
      .replace('data', '')
      .replace('.tsx', '')
      .replace('.mdx', '');

    const route = path === '/index' ? '' : path;

    return {
      url: `https://koenvangilst.nl${route}`,
      lastModified: new Date().toISOString()
    };
  });

  return pages;
}

import fs from 'node:fs';
import path from 'node:path';
import { PostMeta } from './schema';
import { sluggify } from '#/lib/sluggify';
import { calculateReadingTime } from '#/lib/reading-time';

// Pre-compiled by @mdx-js/rollup at build time - NOT runtime FS access
// Each MDX file exports: default (component), frontmatter (object)
const modules = import.meta.glob<{
  default: React.ComponentType;
  frontmatter: Record<string, unknown>;
}>('../../content/*.mdx', { eager: true });

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function getPosts() {
  return Object.entries(modules)
    .map(([filePath, mod]) => {
      const slug = filePath.replace('../../content/', '').replace('.mdx', '');
      const data = { ...mod.frontmatter, slug } as Record<string, unknown>;
      if (Array.isArray(data.tags)) {
        data.tagsAsSlugs = (data.tags as string[]).map(sluggify);
      }
      return PostMeta.parse(data);
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getPost(slug: string) {
  const key = `../../content/${slug}.mdx`;
  const mod = (modules as Record<string, (typeof modules)[string] | undefined>)[key];
  if (!mod) return null;

  const rawSource = fs.existsSync(path.join(CONTENT_DIR, `${slug}.mdx`))
    ? fs.readFileSync(path.join(CONTENT_DIR, `${slug}.mdx`), 'utf-8')
    : '';
  const readingTime = calculateReadingTime(rawSource);

  const data = { ...mod.frontmatter, slug } as Record<string, unknown>;
  if (Array.isArray(data.tags)) {
    data.tagsAsSlugs = (data.tags as string[]).map(sluggify);
  }

  const meta = PostMeta.parse(data);

  return {
    ...meta,
    code: '',
    readingTime,
    Component: mod.default,
  };
}


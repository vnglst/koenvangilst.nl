import { PostMeta } from './schema';
import { sluggify } from '#/lib/sluggify';

// Pre-compiled by @mdx-js/rollup at build time - NOT runtime FS access
// Each MDX file exports: default (component), frontmatter (object)
// The remarkWordCount plugin injects wordCount into frontmatter at build time
const modules = import.meta.glob<{
  default: React.ComponentType;
  frontmatter: Record<string, unknown>;
}>('../../content/*.mdx', { eager: true });

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

  const data = { ...mod.frontmatter, slug } as Record<string, unknown>;
  if (Array.isArray(data.tags)) {
    data.tagsAsSlugs = (data.tags as string[]).map(sluggify);
  }

  // wordCount is injected by remarkWordCount at build time
  const wordCount = typeof data.wordCount === 'number' ? data.wordCount : 0;
  const minutes = Math.ceil(wordCount / 200);
  const readingTime = {
    text: `${minutes} min read`,
    minutes,
    time: minutes * 60 * 1000,
    words: wordCount,
  };

  const meta = PostMeta.parse(data);

  return {
    ...meta,
    code: '',
    readingTime,
    Component: mod.default,
  };
}


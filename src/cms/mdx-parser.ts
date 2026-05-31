import { lazy } from 'react';

// Lazy-loaded MDX components — each post is fetched as a separate chunk on demand.
// This prevents all ~80 MDX modules from being eagerly bundled into the client JS.
const modules = import.meta.glob<{
  default: React.ComponentType;
}>('../../content/*.mdx');

export function getMdxComponent(slug: string): React.ComponentType | undefined {
  const key = `../../content/${slug}.mdx`;
  const load = (modules as Record<string, (typeof modules)[string] | undefined>)[key];
  if (!load) return undefined;
  return lazy(load);
}

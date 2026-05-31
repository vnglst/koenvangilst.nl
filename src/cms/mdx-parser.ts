import { lazy } from 'react';

// Lazy-loaded MDX components — each post is fetched as a separate chunk on demand.
// This prevents all ~80 MDX modules from being eagerly bundled into the client JS.
const modules = import.meta.glob<{
  default: React.ComponentType;
}>('../../content/*.mdx');

// Cache lazy components by key — creating a new lazy() on every render causes
// React to see a new component type each render, triggering an infinite loop.
const cache = new Map<string, React.ComponentType>();

export function getMdxComponent(slug: string): React.ComponentType | undefined {
  const key = `../../content/${slug}.mdx`;
  const load = (modules as Record<string, (typeof modules)[string] | undefined>)[key];
  if (!load) return undefined;
  const cached = cache.get(key);
  if (cached) return cached;
  const component = lazy(load);
  cache.set(key, component);
  return component;
}

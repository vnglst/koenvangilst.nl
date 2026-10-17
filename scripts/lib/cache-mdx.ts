import type mdx from '@mdx-js/rollup';

/** Reuse environment-independent MDX output across the client and SSR builds.
 * The cache lives for one Vite invocation and keys on source as well as module
 * ID, so edits and new builds never reuse stale content or compiler options.
 */
export function cacheMdx(plugin: ReturnType<typeof mdx>): ReturnType<typeof mdx> {
  const cache = new Map<string, { source: string; result: ReturnType<typeof plugin.transform> }>();
  const transform = plugin.transform;
  return {
    ...plugin,
    transform(source, id) {
      if (!/\.mdx?(?:\?|$)/.test(id)) return transform(source, id);
      const cached = cache.get(id);
      if (cached?.source === source) return cached.result;
      const result = transform(source, id);
      cache.set(id, { source, result });
      return result;
    }
  };
}

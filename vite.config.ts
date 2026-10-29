import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypeSlug from 'rehype-slug';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { remarkWordCount } from './src/lib/remark-word-count.ts';

/** Reuse environment-independent MDX output across the client and SSR builds.
 * The cache lives for one Vite invocation and keys on source as well as module
 * ID, so edits and new builds never reuse stale content or compiler options.
 */
function cacheMdx(plugin: ReturnType<typeof mdx>): ReturnType<typeof mdx> {
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

const commitHash = (() => {
  // Prefer SOURCE_COMMIT injected by Docker/CI (git history not available in builder)
  if (process.env.SOURCE_COMMIT) return process.env.SOURCE_COMMIT;
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
})();

const appVersion = (() => {
  try {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
      version?: string;
    };
    return pkg.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
})();

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  server: {
    watch: process.platform === 'darwin' ? { usePolling: true, interval: 250 } : undefined
  },
  define: {
    'import.meta.env.VITE_COMMIT_HASH': JSON.stringify(commitHash),
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(appVersion)
  },
  ssr: {
    external: ['@resvg/resvg-js'],
    noExternal: []
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'react';
          if (id.includes('node_modules/@tanstack/react-router')) return 'tanstack-router';
          if (id.includes('node_modules/@tanstack/react-start')) return 'tanstack-start';
          if (id.includes('node_modules/@tanstack/react-query')) return 'tanstack-query';
        }
      }
    }
  },
  plugins: [
    tailwindcss(),
    cacheMdx(
      mdx({
        remarkPlugins: [remarkGfm, remarkFrontmatter, remarkWordCount, [remarkMdxFrontmatter, { name: 'frontmatter' }]],
        rehypePlugins: [
          rehypeSlug,
          rehypeCodeTitles,
          rehypePrismPlus,
          [rehypeAutolinkHeadings, { properties: { className: ['anchor'] } }]
        ]
      })
    ),
    tanstackStart({
      router: {
        // Exclude files/dirs with single _ prefix (components, etc.) but keep __root.tsx
        routeFileIgnorePattern: '^_(?!_)'
      }
    }),
    viteReact()
  ]
});

export default config;

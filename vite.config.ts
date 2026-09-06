import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
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
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { remarkWordCount } from './src/lib/remark-word-count.ts';

const contentDir = path.join(process.cwd(), 'content');
const postSlugs = readdirSync(contentDir)
  .filter((file) => file.endsWith('.mdx'))
  .map((file) => file.slice(0, -'.mdx'.length));
const tagSlugs = [
  ...new Set(
    postSlugs.flatMap((slug) => {
      const source = readFileSync(path.join(contentDir, `${slug}.mdx`), 'utf8');
      const tags = source.match(/^tags:\s*\n((?:\s*-.*\n?)+)/m)?.[1] ?? '';
      return [...tags.matchAll(/^\s*-\s*['"]?(.+?)['"]?\s*$/gm)]
        .map((match) => match[1].trim().toLowerCase().split(' ').join('-'))
        .filter((tag) => tag !== '--');
    })
  )
];
const photoIds = (() => {
  try {
    return (JSON.parse(readFileSync('public/photos-data.json', 'utf8')) as Array<{ id: number }>).map(({ id }) => id);
  } catch {
    return [];
  }
})();

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
    ...(process.env.NODE_ENV !== 'production' ? [devtools()] : []),
    tailwindcss(),
    mdx({
      remarkPlugins: [remarkGfm, remarkFrontmatter, remarkWordCount, [remarkMdxFrontmatter, { name: 'frontmatter' }]],
      rehypePlugins: [
        rehypeSlug,
        rehypeCodeTitles,
        rehypePrismPlus,
        [rehypeAutolinkHeadings, { properties: { className: ['anchor'] } }]
      ],
      providerImportSource: '@mdx-js/react'
    }),
    tanstackStart({
      prerender: {
        enabled: true,
        autoStaticPathsDiscovery: true,
        crawlLinks: false,
        failOnError: true
      },
      pages: [
        ...postSlugs.map((slug) => ({ path: `/lab/${slug}` })),
        ...tagSlugs.map((slug) => ({ path: `/tag/${slug}` })),
        ...photoIds.map((id) => ({ path: `/photography/${id}` })),
        { path: '/feed.xml', prerender: { enabled: true, outputPath: '/feed.xml', autoSubfolderIndex: false } },
        { path: '/sitemap.xml', prerender: { enabled: true, outputPath: '/sitemap.xml', autoSubfolderIndex: false } }
      ],
      router: {
        // Exclude files/dirs with single _ prefix (components, etc.) but keep __root.tsx
        routeFileIgnorePattern: '^_(?!_)'
      }
    }),
    viteReact()
  ]
});

export default config;

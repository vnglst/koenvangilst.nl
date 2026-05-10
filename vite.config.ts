import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypeSlug from 'rehype-slug'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const commitHash = (() => {
  // Prefer SOURCE_COMMIT injected by Docker/CI (git history not available in builder)
  if (process.env.SOURCE_COMMIT) return process.env.SOURCE_COMMIT;
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
})()

const appVersion = (() => {
  try {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { version?: string }
    return pkg.version ?? '0.0.0'
  } catch {
    return '0.0.0'
  }
})()

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  define: {
    'import.meta.env.VITE_COMMIT_HASH': JSON.stringify(commitHash),
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(appVersion),
  },
  // Native addons cannot be bundled — exclude from both client and server builds
  optimizeDeps: {
    exclude: ['sharp', '@resvg/resvg-js', 'exif-reader'],
  },
  ssr: {
    external: ['sharp', '@resvg/resvg-js', 'exif-reader'],
    noExternal: [],
  },
  plugins: [
    devtools(),
    tailwindcss(),
    mdx({
      remarkPlugins: [
        remarkGfm,
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: 'frontmatter' }],
      ],
      rehypePlugins: [
        rehypeSlug,
        rehypeCodeTitles,
        rehypePrismPlus,
        [rehypeAutolinkHeadings, { properties: { className: ['anchor'] } }],
      ],
      providerImportSource: '@mdx-js/react',
    }),
    tanstackStart({
      router: {
        // Exclude files/dirs with single _ prefix (components, etc.) but keep __root.tsx
        routeFileIgnorePattern: '^_(?!_)',
      },
    }),
    viteReact(),
  ],
})

export default config

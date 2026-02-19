# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About This Site

Personal website built with Next.js, self-hosted on Hetzner. Contains blog posts, data visualizations, and a generative art gallery. Follows a strict self-hosting and open-source philosophy.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run type-check   # TypeScript check (no emit)
npm run lint         # ESLint
npm run test         # Vitest (single run)
npm run test:watch   # Vitest in watch mode
npm run knip         # Detect unused dependencies/exports
```

## Architecture

### Content System

Blog posts live in `content/*.mdx` with YAML frontmatter (`title`, `publishedAt`, `summary`, `tags`, optional `image`). The `cms/` directory handles parsing:

- `cms/mdx-parser.ts` — `getPosts()` reads all posts, `getPost(slug)` compiles a single post with mdx-bundler
- `cms/schema.ts` — Zod schemas for type-safe frontmatter validation
- `content/[slug].components.js` — optional per-post file that exports custom React components used in that post (dynamically imported at render time)

Posts are statically generated at build time via `app/lab/[slug]/page.tsx`.

### Routing

All blog/lab content is under `/lab`. Old routes (`/blog`, `/projects`, `/snippets`, etc.) permanently redirect there via `config/next-redirects.js`.

Key routes:
- `/lab` — post listing
- `/lab/[slug]` — individual post
- `/lab/gen-art-gallery` — iframe-based generative art gallery
- `/photography` — photography portfolio
- `/og` — dynamic Open Graph image generation
- `/feed.xml` — RSS feed

### Deployment

Docker multi-stage build (`Dockerfile`) produces a standalone Next.js output. `docker-entrypoint.sh` runs on startup to fix volume permissions and pre-generate responsive images via `scripts/generate-images.mjs` (multiple widths in JPEG + WebP). The `SOURCE_COMMIT` env var is embedded at build time as `COMMIT_HASH`.

## Content Security Policy (CSP)

When adding new projects to the generative art gallery, you **must** update the Content Security Policy to allow iframe embedding.

### Location

CSP headers are configured in: `/config/next-headers.js`

### Adding a New Project to the Gallery

1. Add the project to the `GENERATIVE_ART_PROJECTS` array in `/app/lab/gen-art-gallery/GenerativeArtGallery.tsx`
2. Add the project's domain to the `frame-src` directive in `/config/next-headers.js`

### Example

If adding `example-viz.koenvangilst.nl`:

```javascript
frame-src 'self' svelte.dev codesandbox.io example-viz.koenvangilst.nl ...;
```

### What Happens If You Forget

If you forget to add the domain to CSP, the browser will block the iframe with an error like:

```
Framing 'https://example-viz.koenvangilst.nl/' violates the following Content Security Policy directive: "frame-src ..."
```

## Dependency Analysis with Knip

This project uses `knip` for detecting unused dependencies and exports. Run with `npm run knip`.

### Known False Positives

Knip cannot follow dynamic imports or detect Docker/deployment usage, so it incorrectly reports these as unused:

- `content/*.components.js` - MDX component files loaded dynamically in `app/lab/[slug]/page.tsx`
- `app/lab/prognosis-2100/(heatmaps)/*.tsx` - Heatmap components used via the components files
- `app/lab/prognosis-2100/(charts)/ChartSection.tsx` - Used by heatmap components
- `hoursFormatter` in `lib/formatters.ts` - Used by SunshineHeatmap.client.tsx
- `scripts/generate-images.mjs` - Used by Docker deployment (copied in Dockerfile)

### Before Deleting "Unused" Files

Always run `npm run build` after deleting files reported by knip to verify they're truly unused. The build will fail if dynamically imported files are missing.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Guidelines

### Think Before Coding

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so.
- If something is unclear, stop and ask.

### Simplicity First

- Minimum code that solves the problem. Nothing speculative.
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" that wasn't requested.

### Surgical Changes

- Touch only what you must. Don't "improve" adjacent code.
- Match existing style, even if you'd do it differently.
- Remove imports/variables/functions that YOUR changes made unused.
- Every changed line should trace directly to the request.

### Goal-Driven Execution

- Define success criteria before starting.
- Transform tasks into verifiable goals.
- Loop until verified.

### Close the Feedback Loop First

- Before solving, build a way to observe.
- A tight feedback loop is the foundation of execution.
- Prefer building a reproduction script before the real implementation.

## About This Site

Personal website built with TanStack Start + Vite, self-hosted on Hetzner. Contains blog posts, data visualizations, and a generative art gallery. Follows a strict self-hosting and open-source philosophy.

## Commands

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Production build
npm run start        # Start production server (node dist/server/server.js)
npm run type-check   # TypeScript check (no emit)
npm run lint         # ESLint
npm run format       # Prettier + ESLint auto-fix
npm run test         # Vitest (single run)
npx vitest           # Vitest in watch mode
npm run knip         # Detect unused dependencies/exports
```

## Architecture

### Content System

Blog posts live in `content/*.mdx` with YAML frontmatter (`title`, `publishedAt`, `summary`, `tags`, optional `image`). The `src/cms/` directory handles parsing:

- `src/cms/mdx-parser.ts` — `getPosts()` reads all posts, `getPost(slug)` compiles a single post via `import.meta.glob`
- `src/cms/schema.ts` — Zod schemas for type-safe frontmatter validation
- `content/[slug]/` — optional per-post directory with custom React components (e.g. `GrowingVines.tsx`), imported directly in the MDX file

Posts are server-rendered via `src/routes/lab/$slug.tsx`, which loads MDX modules compiled by `@mdx-js/rollup` at build time.

### Routing

All blog/lab content is under `/lab`. Old routes (`/blog`, `/projects`, `/snippets`, etc.) redirect there via catch-all routes in `src/routes/`.

Key routes:

- `/lab` — post listing (`src/routes/lab/index.tsx`)
- `/lab/$slug` — individual post (`src/routes/lab/$slug.tsx`)
- `/lab/gen-art-gallery` — iframe-based generative art gallery
- `/photography` — photography portfolio
- `/og` — dynamic Open Graph image generation
- `/feed.xml` — RSS feed (`src/routes/feed[.]xml.ts`)
- `/sitemap.xml` — dynamic sitemap (`src/routes/sitemap[.]xml.ts`)
- `/health` — health check endpoint

TanStack Router generates `src/routeTree.gen.ts` automatically — never edit this file manually. Files/dirs prefixed with a single `_` are treated as non-route components (e.g. `_components/`, `_charts/`).

### Deployment

Docker multi-stage build (`Dockerfile`) produces a standalone Node.js server (`dist/server/server.js`). `docker-entrypoint.sh` runs on startup to fix volume permissions and pre-generate responsive images via `scripts/generate-images.mjs` (multiple widths in JPEG + WebP). The `SOURCE_COMMIT` env var is embedded at build time via `vite.config.ts` as `import.meta.env.VITE_COMMIT_HASH`.

## Content Security Policy (CSP)

When adding new projects to the generative art gallery, you **must** update the Content Security Policy to allow iframe embedding.

### Location

CSP headers are not yet centrally configured in the TanStack Start app. They need to be added as server middleware or per-route `headers()` in `src/routes/__root.tsx`. This is a known gap from the Next.js migration.

### Adding a New Project to the Gallery

1. Add the project to the `GENERATIVE_ART_PROJECTS` array in `src/routes/lab/gen-art-gallery/_components/GenerativeArtGallery.tsx`
2. Add the project's domain to the `frame-src` CSP directive once CSP is configured

### What Happens If You Forget

If you forget to add the domain to CSP, the browser will block the iframe with an error like:

```
Framing 'https://example-viz.koenvangilst.nl/' violates the following Content Security Policy directive: "frame-src ..."
```

## Dependency Analysis with Knip

This project uses `knip` for detecting unused dependencies and exports. Run with `npm run knip`.

### Known False Positives

Knip cannot follow Vite's `import.meta.glob`, MDX compilation, or Docker/deployment usage, so it may incorrectly report these as unused:

- `scripts/generate-images.mjs` — used by Docker entrypoint at runtime
- `@tanstack/router-plugin` — used in `vite.config.ts` as a Vite plugin
- `gray-matter` — used in `src/cms/mdx-parser.ts` for frontmatter parsing
- `@testing-library/react` / `@testing-library/dom` — used in test files via Vitest
- `@types/mdx` — provides TypeScript types for `.mdx` imports
- `husky` — drives the `.husky/pre-commit` hook

### Before Deleting "Unused" Files

Always run `npm run build` after deleting files reported by knip to verify they're truly unused. The build will fail if Vite-compiled MDX components or server functions are missing.

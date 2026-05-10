<!-- intent-skills:start -->
## Skill Loading

Before substantial work:
- Skill check: run `npx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# koenvangilst.nl - TanStack Start (Self-hosted, Node.js)

Personal website of Koen van Gilst. Migrated from Next.js App Router to TanStack Start, self-hosted on Hetzner CX33 via Coolify.

## Scaffolding

```bash
# TanStack CLI command used (from /Users/vnglst/Code):
npx @tanstack/cli@latest create my-tanstack-app --agent --deployment cloudflare --add-ons tanstack-query
# Framework: React, Toolchain: ESLint, No demo pages, No git init

# TanStack Intent commands:
npx @tanstack/intent@latest install   # created AGENTS.md, installed skill runner
npx @tanstack/intent@latest list      # listed 31 skills across 9 packages
npx @tanstack/intent@latest load @tanstack/react-start#lifecycle/migrate-from-nextjs
npx @tanstack/intent@latest load @tanstack/start-client-core#start-core/deployment
npx @tanstack/intent@latest load @tanstack/start-client-core#start-core/server-routes
```

> **Note on deployment target**: The CLI was invoked with `--deployment cloudflare` as specified, but the site is self-hosted on Node.js (Hetzner + Coolify). The `@cloudflare/vite-plugin` and `wrangler` were subsequently removed and replaced with the Node.js adapter (TanStack Start's default). The Cloudflare add-on's Query/ESLint integrations were kept.

## Philosophy

- Self-hosted, open source, minimal external dependencies
- No Vercel, no GitHub Actions builds - Docker container deployed via Coolify on Hetzner
- FOSS only

## Stack

- **Framework**: TanStack Start 1.x (TanStack Router + React 19)
- **Build**: Vite 8 + `@tanstack/react-start/plugin/vite` (Node.js adapter, default target)
- **Runtime**: Node.js 24 on Hetzner CX33 (x86_64) via Docker + Coolify
- **Styling**: Tailwind CSS v4 + `@tailwindcss/vite`
- **Content**: MDX compiled at build time via `@mdx-js/rollup` + `import.meta.glob`
- **Data fetching**: TanStack Query (client) + `createServerFn` loaders
- **State**: Zustand (theme toggle)
- **Charts**: ECharts + D3

## Commands

```bash
npm run dev          # Local dev server (port 3000)
npm run build        # Production build → dist/
npm run start        # Run built server: node dist/server/server.js
npm run test         # Vitest unit tests
npm run type-check   # tsc --noEmit
npm run lint         # ESLint
```

## Docker / Deployment

```bash
# Build image (pass commit SHA for footer display)
docker build --build-arg SOURCE_COMMIT=$(git rev-parse HEAD) -t koenvangilst .

# Run locally to test
docker run -d -p 3000:3000 --name koenvangilst-test koenvangilst
curl http://localhost:3000/health   # → {"status":"ok"}

# Cleanup
docker stop koenvangilst-test && docker rm koenvangilst-test
```

Build output goes to `.output/`:
- `.output/server/index.mjs` — Node.js HTTP server (Nitro/h3)
- `.output/public/` — static assets served by the server

Coolify is configured on a separate Raspberry Pi 5. Set "Include Source Commit in Build" in Advanced settings to inject `SOURCE_COMMIT` build arg.

## Architecture

### Content / CMS

- Blog posts live in `content/*.mdx` with YAML frontmatter
- `@mdx-js/rollup` compiles MDX at build time (Vite processes all content files before bundling)
- `src/cms/mdx-parser.ts` — uses `import.meta.glob` to access compiled MDX modules
- Each MDX file exports: `default` (React component) + `frontmatter` (object, via `remark-mdx-frontmatter`)
- Schema validation via `src/cms/schema.ts` (Zod)
- **Why build-time MDX**: The legacy `mdx-bundler` did runtime compilation via Node.js `esbuild`+`fs`. Build-time compilation is faster at request time and works with any deployment target.

### Routing (TanStack Router file-based)

- `src/routes/__root.tsx` — root layout, meta tags, FOUC-prevention theme script, Plausible tracking
- `src/routes/index.tsx` — home page
- `src/routes/lab/index.tsx` — blog/lab listing with `q` search param (client-side filter)
- `src/routes/lab/$slug.tsx` — individual MDX posts
- `src/routes/lab/co2/` — live CO2 monitor dashboard (SWR polling)
- `src/routes/lab/gen-art-gallery/` — generative art iframe gallery
- `src/routes/lab/ons-land/` — D3 land-use hexbin chart
- `src/routes/lab/prognosis-2100/` — ECharts climate dashboard
- `src/routes/photography/` — photo gallery
- `src/routes/tag/$slug.tsx` — posts filtered by tag
- **Server routes** (API): `feed.xml.ts`, `health.ts`, `llm-context.ts`, `og.ts`, `sitemap[.]xml.ts`
- **Legacy redirects**: `blog/`, `blog/$`, `labs/`, `projects/`, `clients/`, `portfolio/`, `snippets/`, `photography/photo/$`

### Key Patterns

**`createServerFn`**: All server-side data fetching goes through `createServerFn({ method: 'GET' }).handler(...)`. Route `loader:` calls the server fn. Component reads data with `Route.useLoaderData()`.

**`_components/` convention**: Files/folders prefixed with `_` (single) are excluded from route generation by `routeFileIgnorePattern: '^_(?!_)'` in vite.config.ts.

**`#/*` path alias**: All cross-module imports use `#/components/...`, `#/lib/...`, etc. (configured in tsconfig + `package.json` `imports` field).

**MDX in `lab/$slug`**: The route loader returns serializable metadata. The component uses `import.meta.glob` to re-import the MDX React component by slug client-side (avoids serialising React components over the wire).

### Environment Variables

Injected at build time via `define` in `vite.config.ts`:
- `import.meta.env.VITE_COMMIT_HASH` — git SHA (used in Footer)
- `import.meta.env.VITE_APP_VERSION` — package.json version (used in Footer)

These are baked in at build time, not runtime env vars.

## What Was Not Migrated 1:1

| Feature | Reason | Status |
|---|---|---|
| Next.js `localFont` | Not available outside Next.js | Replaced with CSS `@font-face` rules in `styles/fonts.css` |
| Next.js Image optimization | `next/image` auto-resizes/optimizes; replaced with plain `<img>` | The legacy `scripts/generate-images.mjs` pre-generates responsive sizes at container startup |
| Per-post `.components.js` dynamic imports | Legacy dynamically imports per-post component files at request time; Vite build-time MDX uses static imports instead | MDX files import their custom components directly with static `import` |

## Build Output

Build outputs to `dist/`:
- `dist/server/server.js` — Node.js HTTP server (Nitro/h3)
- `dist/public/` — static assets served by the server

> **Note**: The AGENTS.md originally said `.output/server/index.mjs` but TanStack Start without the Cloudflare plugin outputs to `dist/server/server.js`. The `package.json` `start` script and `Dockerfile` CMD are correct.

## Completed TODOs

All original TODOs have been resolved:

- ✅ `/og` dynamic OG image generation with `satori` + `resvg-js` using IBM Plex Sans TTF (in `public/fonts/IBMPlexSans-Bold.ttf`)
- ✅ Photography EXIF reading via `src/lib/photos.ts` using `sharp`+`exif-reader` with 1-hour in-process cache
- ✅ `scripts/generate-images.mjs` copied and called from `docker-entrypoint.sh`
- ✅ Per-post MDX component imports (static `import` in each MDX file)
- ✅ All routes tested with Playwright + curl (100% pass rate)
- ✅ Legacy-source cleaned up



# koenvangilst.nl

The source code of my personal website and blog. Built with TanStack Start + Vite, self-hosted on Hetzner. Contains blog posts, data visualizations, and a generative art gallery. Follows a strict self-hosting and open-source philosophy.

> **For coding agents**: Before making any changes, read this README in full. All project conventions, validation requirements, and architectural decisions are documented here.

## Philosophy

- **Self-hosted, open source, minimal external dependencies**
- **No Vercel, no GitHub Actions builds** — Docker container deployed via Coolify on Hetzner
- **FOSS only** — all software components must be free and open source
- **Full control** — preference for solutions that can be fully controlled and maintained without relying on third-party services

When suggesting solutions or improvements, prioritize self-hosted, open-source alternatives over managed services (e.g., no Vercel, no proprietary CDNs).

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) 1.x with [TanStack Router](https://tanstack.com/router) (file-based routing)
- **Runtime**: [React 19](https://react.dev/) with server functions via Vite
- **Build**: Vite 8 + `@tanstack/react-start/plugin/vite` (Node.js adapter, default target)
- **Content**: [MDX](https://github.com/mdx-js/mdx) compiled at build time via [@mdx-js/rollup](https://mdxjs.com/packages/rollup/) + `import.meta.glob`
- **Data fetching**: TanStack Query (client) + `createServerFn` loaders
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom design system + `@tailwindcss/vite`
- **State**: Zustand (theme toggle)
- **Charts**: ECharts + D3
- **Analytics**: [Plausible](https://plausible.io/) (self-hosted) for privacy-friendly analytics
- **Code Highlighting**: [Rehype Prism Plus](https://github.com/timlrx/rehype-prism-plus)
- **Testing**: [Vitest](https://vitest.dev/) + Playwright end-to-end tests
- **Server**: Node.js 24 (LTS) on Hetzner CX33 (x86_64) via Docker + Coolify
- **Reverse Proxy**: Nginx (serves static assets, rate-limiting, security headers, health checks)

## Project Structure

```
├── src/
│   ├── routes/             # TanStack Router file-based routes
│   │   ├── __root.tsx     # Root layout with fonts and metadata
│   │   ├── index.tsx      # Homepage
│   │   ├── about.tsx      # About page
│   │   ├── lab/           # Blog posts and projects showcase
│   │   ├── photography/   # Photography portfolio
│   │   ├── feed[.]xml.ts  # RSS feed generation
│   │   └── sitemap[.]xml.ts # Dynamic sitemap generation
│   ├── cms/               # Content Management System
│   │   ├── mdx-parser.ts  # MDX file parsing and processing
│   │   └── schema.ts      # Zod schemas for content validation
│   ├── components/        # Reusable React components
│   │   ├── content/       # Content-specific components (MDX, articles)
│   │   ├── forms/         # Form components
│   │   ├── layout/        # Layout components (Container, etc.)
│   │   ├── theme/         # Theme and dark mode components
│   │   └── ui/            # UI primitives (buttons, links, etc.)
│   ├── integrations/      # Framework integrations (TanStack Query provider)
│   ├── lib/               # Utility functions
│   ├── router.tsx          # Router configuration
│   ├── server.ts           # Server entry configuration
│   ├── services/          # External service integrations
│   └── styles/            # Global CSS styles
├── content/               # MDX blog posts and articles
│   ├── *.mdx             # Individual blog posts with frontmatter
│   └── [slug]/            # Per-post directories with custom React components
├── e2e/                   # Playwright end-to-end tests
├── nginx/                 # Nginx configuration for production
├── public/                # Static assets
├── scripts/               # Build and deployment scripts
├── Dockerfile             # Multi-stage Docker build
├── docker-entrypoint.sh   # Container startup script
├── vite.config.ts         # Vite build configuration
├── vitest.config.ts       # Vitest test configuration
├── knip.json              # Knip dependency analysis config
├── eslint.config.js       # ESLint configuration
├── prettier.config.js     # Prettier configuration
└── tsconfig.json          # TypeScript configuration
```

## Content Management

### MDX Processing Pipeline

1. **Content Discovery**: MDX files are read from the `/content` directory
2. **Frontmatter Parsing**: `remark-frontmatter` and `remark-mdx-frontmatter` extract metadata at build time
3. **Schema Validation**: Zod ensures content structure integrity with type safety
4. **MDX Compilation**: [@mdx-js/rollup](https://mdxjs.com/packages/rollup/) processes MDX with custom components
5. **Enhancement**: Rehype plugins add code highlighting, auto-linking headings, and more

### Content Schema

Each blog post includes structured frontmatter:

```yaml
---
title: 'Post Title'
publishedAt: '2024-01-01'
summary: 'Brief description for SEO and previews'
tags: ['article', 'technology']
image:
  src: '/static/images/post.jpg'
  alt: 'Image description'
  width: 1200
  height: 630
  showAsHeader: true
---
```

### Custom MDX Components

- **Images**: Responsive images with automatic sizing
- **Links**: Enhanced links with external link indicators
- **Code Blocks**: Syntax highlighted with copy functionality
- **Interactive Elements**: Custom React components for demos

Per-post custom React components live in `content/[slug]/` (e.g. `GrowingVines.tsx`) and are imported directly in the MDX file with static `import`.

## Features

- **Server-Side Rendering**: Full SSR via TanStack Start for optimal performance
- **RSS Feed**: Automatically generated from blog posts
- **Sitemap**: Dynamic sitemap including all content
- **Photography Portfolio**: Image gallery with EXIF data and optimized responsive images, generated from Zipline originals and served from the website's local photo mirror
- **Dark Mode**: Dark by default with user-preference override. Light mode is only shown when explicitly chosen via the theme toggle. System preference (`prefers-color-scheme`) is intentionally ignored in favor of a consistent dark-first experience.
- **Reading Time**: Calculated for each blog post
- **Tag System**: Categorized content with slug-based URLs
- **SEO Optimized**: Meta tags, Open Graph, and structured data
- **LLM Honeypot**: Tracks when AI models access site content via `/llm-context`

### Photography Sync

Photography delivery is handled by the `zipline-sync/` service in the same Docker Compose app as the website. Original uploads live in Zipline's `photography-originals` folder, the sync job downloads those originals, generates hashed JPEG/WebP variants plus a `photos-data.json` manifest into the shared `photography-data` volume, and Nginx serves the optimized files from `/photos/*` with immutable cache headers. The website reads the local manifest from `/data/photography/photos-data.json`, so the gallery keeps serving the last successful sync if Zipline is down.

## ADRs

Architecture decision records live in [`docs/ADRs/`](docs/ADRs/).

## Running Locally

```bash
git clone https://github.com/vnglst/koenvangilst.nl.git
cd koenvangilst.nl
npm install
npm run dev
```

Visit `http://localhost:3000` to see the site in development mode.

## Development Scripts

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Production build → dist/
npm run start        # Run built server: srvx --entry dist/server/server.js
npm run preview      # Preview production build locally
npm run type-check   # TypeScript check (no emit)
npm run lint         # ESLint
npm run format       # Prettier + ESLint auto-fix
npm run check        # Check formatting with Prettier
npm run test              # Vitest (single run)
npm run test:e2e          # Playwright end-to-end tests
npm run test:e2e:ui       # Playwright end-to-end tests with UI
npm run test:e2e:docker   # Playwright e2e tests against a Docker/Nginx container
npx vitest           # Vitest in watch mode
npm run knip         # Detect unused dependencies/exports
```

## Validation & Pre-commit Checks

**IMPORTANT**: Before committing code changes, ALWAYS run:

```bash
npm run type-check  # TypeScript type checking
npm run lint        # ESLint
npm run test        # Vitest unit tests
```

If any of these fail, fix the issues before committing. This ensures code quality and prevents broken builds from being deployed.

**Exception**: When dependencies are not installed (e.g., in CI or lightweight environments), these checks may be skipped, but should be run in local development before pushing.

**E2E for large changes**: When making a large refactor or other broad change — especially routing changes, content rendering changes, image handling changes, shared layout updates, or cross-cutting UI work — ALSO run:

```bash
npm run build && npm run start &  # Build first, then start the production server
npm run test:e2e                  # Playwright end-to-end coverage for main site flows
```

For the most production-like validation (Nginx reverse proxy, legacy redirects, CSP headers, and static asset serving), run:

```bash
npm run test:e2e:docker           # Build image, run container, and run e2e suite
```

> **Important**: Always run e2e tests against a production **build** (`npm run build && npm run start` or `npm run test:e2e:docker`), never against the dev server (`npm run dev`). The dev server behaves differently (no SSR optimizations, different code paths) and can produce false positives or false negatives.

Use the Playwright suite as a required regression check when a change affects multiple user flows.

**Husky pre-commit hook**: `.husky/pre-commit` automatically runs `npx lint-staged` (ESLint + Prettier on staged files) and `npm run type-check`. Unit tests and E2E tests are NOT run automatically by the hook — run them manually before pushing.

## Coding Guidelines

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

### No Barrel/Index Files

This project intentionally avoids barrel (index.ts) re-export files. All imports use direct deep paths like `#/components/ui/Button`. This maximizes tree-shaking and makes the import graph explicit. Barrel files can cause circular dependencies, slow down bundlers with re-export chains, and obscure the actual module source.

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

### Prevent Layout Shifts (CLS)

Layout shifts degrade perceived performance and user experience. Always avoid them.

**Loading states must preserve the shell layout.** When a route uses `Suspense` or a loading skeleton, the fallback must include the same outer layout (sidebar, header, footer) as the final content. If the skeleton omits the sidebar, the sidebar will disappear and reappear during navigation, causing a visible jump.

**Checklist for every new or changed route:**

1. **Match the skeleton to the layout** - If the final page renders inside `<Container>`, the skeleton must also render inside `<Container>`.
2. **Reserve space for async content** - If a component loads asynchronously inside a page, its placeholder should occupy the same dimensions so surrounding elements do not move.
3. **Delay skeletons by ~1 s** - Fast loads should never flash a skeleton. Use a small timer (e.g. `setTimeout(..., 1000)`) so the placeholder only appears when a load genuinely takes longer than one second. This prevents a jarring "flash of skeleton" for typical fast navigation.
4. **Verify with the Layout Instability API** - The Playwright e2e suite guards against this. When adding a new route with async content, include a CLS test:
   ```bash
   npm run test:e2e  # e2e/layout-shift.spec.ts checks CLS < 0.1
   ```
5. **Test client-side navigation** - Layout shifts often only appear during SPA navigation, not on direct page loads. Navigate from a stable page (e.g. `/lab`) to the new route and watch the sidebar.

**What to watch for:**

- Sidebars or fixed navigation that vanish and reappear in a different position.
- Images without explicit `width` and `height` that push text down as they load.
- Font swaps that reflow text when web fonts arrive.
- Asynchronous charts or visualisations that expand from a zero-height placeholder.
- Skeletons that appear for a split second on every fast navigation, creating a strobe-like effect.

**Example of a correct skeleton with delay:**

```tsx
// lab/$slug.tsx - Skeleton wraps the same Container so the sidebar stays put.
// It is delayed by 1 s to avoid flashing on fast loads.
function DelayedSkeleton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return <MarkdownLayoutSkeleton />;
}

function MarkdownLayoutSkeleton() {
  return (
    <Container>
      <div className="mx-auto w-full max-w-[700px] animate-pulse">
        <div className="mb-4 h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="space-y-3">
          <div className="h-4 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </Container>
  );
}
```

## Architecture

### Content / CMS

- Blog posts live in `content/*.mdx` (and optionally in `content/[slug]/index.mdx`) with YAML frontmatter
- Per-post custom React components live in `content/[slug]/` directories and are imported directly in the MDX file with static `import`
- `@mdx-js/rollup` compiles MDX at build time (Vite processes all content files before bundling)
- `src/cms/mdx-parser.ts` — uses `import.meta.glob` to access compiled MDX modules
- Each MDX file exports: `default` (React component) + `frontmatter` (object, via `remark-mdx-frontmatter`)
- Schema validation via `src/cms/schema.ts` (Zod)
- **Why build-time MDX**: The legacy `mdx-bundler` did runtime compilation via Node.js `esbuild`+`fs`. Build-time compilation is faster at request time and works with any deployment target.

### Routing (TanStack Router file-based)

- `src/routes/__root.tsx` — root layout, meta tags, FOUC-prevention theme script, Plausible tracking
- `src/routes/index.tsx` — home page
- `src/routes/about.tsx` — about page
- `src/routes/lab/index.tsx` — blog/lab listing with `q` search param (client-side filter)
- `src/routes/lab/$slug.tsx` — individual MDX posts
- `src/routes/lab/co2/` — live CO2 monitor dashboard (SWR polling)
- `src/routes/lab/gen-art-gallery/` — generative art iframe gallery
- `src/routes/lab/ons-land/` — D3 land-use hexbin chart
- `src/routes/lab/prognosis-2100/` — ECharts climate dashboard
- `src/routes/photography/` — photo gallery
- `src/routes/tag/$slug.tsx` — posts filtered by tag
- **Server routes** (API): `feed.xml.ts`, `health.ts`, `llm-context.ts`, `og.tsx`, `sitemap[.]xml.ts`
- **Legacy redirects**: `blog/`, `blog/$`, `labs/`, `projects/`, `clients/`, `portfolio/`, `snippets/`, `photography/photo/$`

TanStack Router generates `src/routeTree.gen.ts` automatically — never edit this file manually. Files/dirs prefixed with a single `_` are treated as non-route components (e.g. `_components/`, `_charts/`).

### Key Patterns

**`createServerFn`**: All server-side data fetching goes through `createServerFn({ method: 'GET' }).handler(...)`. Route `loader:` calls the server fn. Component reads data with `Route.useLoaderData()`.

**`_components/` convention**: Files/folders prefixed with `_` (single) are excluded from route generation by `routeFileIgnorePattern: '^_(?!_)'` in vite.config.ts.

**`#/*` and `@/*` path aliases**: Cross-module imports use `#/components/...`, `#/lib/...`, etc. Both `#/*` and `@/*` are configured in `tsconfig.json` (paths) and `package.json` (imports field). The codebase primarily uses `#/*`.

**MDX in `lab/$slug`**: The route loader returns serializable metadata. The component uses `import.meta.glob` to re-import the MDX React component by slug client-side (avoids serialising React components over the wire).

### Environment Variables

Injected at build time via `define` in `vite.config.ts`:

- `import.meta.env.VITE_COMMIT_HASH` — git SHA (used in Footer)
- `import.meta.env.VITE_APP_VERSION` — package.json version (used in Footer)

These are baked in at build time, not runtime env vars.

## Docker / Deployment

### Hosting Architecture

- **Production deployment**: Self-hosted on Hetzner Cloud CX33 (4 vCPU, 7.6GB RAM, x86_64/amd64)
- **Deployment platform**: Coolify v4 (self-hosted on separate Raspberry Pi 5)
- **Build process**: Docker builds run on Hetzner server (expect ~4min builds with TanStack Start + Vite)
- **Container runtime**: Docker Engine with BuildKit cache mounts for build optimization

### Deployment Target

- **Architecture**: linux/amd64 (Hetzner CX33 is x86_64, NOT ARM)
- **Base images**: Use `node:24-alpine` for production builds
- **Build optimization**: BuildKit cache mounts are configured for Vite build cache

### Coolify Configuration

Enable "Include Source Commit in Build" in Advanced settings to display commit hash in footer.

### Build & Run Locally

```bash
# Build image (pass commit SHA for footer display)
docker build --build-arg SOURCE_COMMIT=$(git rev-parse HEAD) -t koenvangilst .

# Run locally to test
docker run -d -p 3000:80 --name koenvangilst-test koenvangilst
curl http://localhost:3000/health   # → OK

# Cleanup
docker stop koenvangilst-test && docker rm koenvangilst-test
```

### Production Container Architecture

The Docker image uses a multi-stage build (`Dockerfile`) with **Nginx as the reverse proxy** and **Node.js as the SSR backend**:

- **Nginx** listens on `0.0.0.0:80` inside the container and handles:
  - Static assets directly (client bundles, fonts, public files) with long cache headers
  - Health checks (`/health`) directly without hitting Node.js
  - Rate limiting on SSR endpoints (30 req/s per IP)
  - Security headers including Content-Security-Policy, HSTS, X-Frame-Options
  - Gzip compression
  - Proxying everything else to Node.js with streaming support
- **Node.js SSR server** runs on `127.0.0.1:3001` (internal only) via `srvx --entry server/server.js`
- `docker-entrypoint.sh` starts Node.js in the background, then starts Nginx in the foreground

Build output goes to `dist/`:

- `dist/server/server.js` — Node.js SSR server
- `dist/client/` — static client assets (JS/CSS bundles, fonts) served by Nginx

Inside the container, the `dist/` contents are copied to `/app/`, so paths become:

- `/app/server/server.js` — SSR entry point
- `/app/client/` — static asset root for Nginx

### Startup Scripts

On container startup, `docker-entrypoint.sh` starts the Node.js SSR server and Nginx. No image generation happens at website startup. Photography assets are generated by the separate `zipline-sync` container and served from the shared Docker volume mounted at `/data/photography`. See `zipline-sync/` for the cron service that processes photos and writes the manifest.

### Testing Docker Builds Locally

Before deploying to Coolify, test the Docker build locally:

```bash
# Build the image
docker build --build-arg SOURCE_COMMIT=$(git rev-parse HEAD) -t koenvangilst-test .

# Run the container
docker run -d -p 3000:80 --name koenvangilst-test koenvangilst-test

# Check logs
docker logs koenvangilst-test
# Should show: "Starting Node.js SSR server on 127.0.0.1:3001..."
# Should show: "Starting Nginx on 0.0.0.0:80..."

# Test health check
curl http://localhost:3000/health
# Should return: OK

# Test the local photo mirror endpoint after zipline-sync has run
curl -I http://localhost:3000/photos/example.webp
# Should include: Cache-Control: public, max-age=31536000, immutable

# Cleanup
docker stop koenvangilst-test && docker rm koenvangilst-test
```

### Development Environment

- **Local Docker**: Use only free and open source tooling (avoid proprietary services like Docker Desktop; prefer Colima)
- **Container runtime**: Colima on macOS - use commands like `colima start`/`colima stop` when documenting workflows
- **BuildKit**: Requires the open source `docker-buildx` CLI plugin - install via Homebrew (`brew install docker-buildx`)

## Content Security Policy (CSP)

The Content Security Policy is configured in `nginx/nginx.conf` and applied to all SSR/API responses by Nginx. It includes directives for scripts, styles, images, frames, and other resources.

When adding new projects to the generative art gallery, you **must** update the CSP to allow iframe embedding.

### Adding a New Project to the Gallery

1. Add the project to the `GENERATIVE_ART_PROJECTS` array in `src/routes/lab/gen-art-gallery/_components/GenerativeArtGallery.tsx`
2. Add the project's domain to the `frame-src` directive in `nginx/nginx.conf`
3. Rebuild and redeploy the Docker image for the CSP change to take effect

### What Happens If You Forget

If you forget to add the domain to CSP, the browser will block the iframe with an error like:

```
Framing 'https://example-viz.koenvangilst.nl/' violates the following Content Security Policy directive: "frame-src ..."
```

## Dependency Analysis with Knip

This project uses `knip` for detecting unused dependencies and exports. Run with `npm run knip`.

### Known False Positives

Knip cannot follow Vite's `import.meta.glob`, MDX compilation, or Docker/deployment usage, so it may incorrectly report these as unused:

- `@tanstack/router-plugin` — used in `vite.config.ts` as a Vite plugin
- `@types/mdx` — provides TypeScript types for `.mdx` imports
- `husky` — drives the `.husky/pre-commit` hook

### Before Deleting "Unused" Files

Always run `npm run build` after deleting files reported by knip to verify they're truly unused. The build will fail if Vite-compiled MDX components or server functions are missing.

## LLM Honeypot

The website includes a honeypot mechanism to track when LLMs access and use the content.

**How it works:**

1. `/llms.txt` includes an instruction directing LLMs to check `/llm-context` for "additional context"
2. Resource at `/llm-context` accepts query parameters:
   - `topic` - What they're researching
   - `llm_name` - Model name (Claude, GPT-4, etc)
   - `findings` - What they found
3. Reports are sent to Plausible Analytics as custom events

**Viewing reports:**
Reports can be viewed in the Plausible Analytics dashboard:

- Event name: "LLM Report"
- Custom properties: `topic`, `llm_name`, `findings`
- Dashboard: https://plausible.koenvangilst.nl

**Key files:**

- `/public/llms.txt` - Contains honeypot instruction
- `/src/routes/llm-context.ts` - Context resource that sends events to Plausible

## Writing Style

When writing or editing blog posts and documentation:

- **Punctuation**: Use regular hyphens (-) instead of em-dashes (—) for readability and simplicity
- **Example**: "No log parsing, no database queries - just a clean dashboard" ✅
- **Avoid**: "No log parsing, no database queries—just a clean dashboard" ❌

## What Was Not Migrated 1:1

| Feature                                   | Reason                                                                                                               | Status                                                                                                        |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Next.js `localFont`                       | Not available outside Next.js                                                                                        | Replaced with CSS `@font-face` rules in `styles/fonts.css`                                                    |
| Next.js Image optimization                | `next/image` auto-resizes/optimizes; replaced with plain `<img>`                                                     | `zipline-sync/` pre-generates responsive variants into the shared photo mirror and publishes a local manifest |
| Per-post `.components.js` dynamic imports | Legacy dynamically imports per-post component files at request time; Vite build-time MDX uses static imports instead | MDX files import their custom components directly with static `import`                                        |

## Completed TODOs

All original TODOs have been resolved:

- ✅ `/og` static OG image generation with SVG + `resvg-js` using IBM Plex Sans TTF (in `public/fonts/IBMPlexSans-Bold.ttf`)
- ✅ Photography EXIF reading moved to the separate `zipline-sync/` service with a 10-minute in-process manifest cache in the main app
- ✅ Startup image generation removed from the main website container
- ✅ Per-post MDX component imports (static `import` in each MDX file)
- ✅ All routes tested with Playwright + curl (100% pass rate)
- ✅ Legacy-source cleaned up

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

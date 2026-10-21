# koenvangilst.nl

The source code of my personal website and blog. Built with TanStack Start + Vite, self-hosted on Hetzner. Contains blog posts, data visualizations, and a generative art gallery. Follows a strict self-hosting and open-source philosophy.

Contributor setup, architecture, validation, and deployment are documented below. AI coding instructions live in [AGENTS.md](AGENTS.md).

## Philosophy

- **Self-hosted, open source, minimal external dependencies**
- **No Vercel, no GitHub Actions builds** — Docker container deployed via Coolify on Hetzner
- **FOSS only** — all software components must be free and open source
- **Full control** — preference for solutions that can be fully controlled and maintained without relying on third-party services

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
- **Server**: Node.js 26.12.1 on Hetzner CX33 (x86_64) via Docker + Coolify
- **Reverse Proxy**: Nginx (serves static assets, rate-limiting, security headers, health checks)

## Project Structure

```
├── src/
│   ├── routes/             # TanStack Router file-based routes
│   │   ├── __root.tsx     # Root layout with fonts and metadata
│   │   ├── index.tsx      # Homepage
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
│   └── styles/            # Global CSS styles
├── content/               # MDX blog posts and articles
│   ├── *.mdx             # Individual blog posts with frontmatter
│   └── [slug]/            # Per-post directories with custom React components
├── e2e/                   # Playwright end-to-end tests
├── nginx/                 # Nginx configuration for production
├── og-generator/          # Isolated Docker build and dependencies for OG rendering
├── public/                # Static assets
├── scripts/               # Build and deployment scripts
├── Dockerfile             # Multi-stage Docker build
├── docker-entrypoint.sh   # Container startup script
├── vite.config.ts         # Vite build configuration
├── vitest.config.ts       # Vitest test configuration
├── knip.json              # Knip dependency analysis config
├── .oxlintrc.json         # Oxlint configuration
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

### Design reference

Use `/design-system` for the live component reference and [docs/design-system.md](docs/design-system.md) for the few implementation decisions that are not apparent from the components and styles.

### Photography Sync

Local previews read `public/photos-data.json` by default, using the same photo mirror as development. `PHOTOS_MANIFEST_PATH` overrides this in production or tests. A remote manifest is used only when `ZIPLINE_PHOTOS_DATA_URL` is explicitly configured.

Photography delivery is handled by the `zipline-sync/` service in the same Docker Compose app as the website. Original uploads live in Zipline's `photography-originals` folder, the sync job downloads those originals, generates hashed JPEG/WebP variants plus a `photos-data.json` manifest into the shared `photography-data` volume, and Nginx serves the optimized files from `/photos/*` with immutable cache headers. The website reads the local manifest from `/data/photography/photos-data.json`, so the gallery keeps serving the last successful sync if Zipline is down.

### Open Graph Image Generation

Open Graph images are generated after deployment by the one-shot `og-generator` service. It starts after the website health check succeeds, renders only missing content-addressed images, writes them to the persistent `og-data` volume, and exits. Nginx serves completed images from `/og/*` with immutable cache headers. While a new image is still being generated, Nginx returns a generic refined OG fallback image with the site title, served with `Cache-Control: no-store` so crawlers can retry the same URL later.

The volume manifest and hashed PNG files persist across deployments. Existing files are deliberately retained because previously published OG URLs must remain valid. Prune the volume manually only when old URLs no longer need to work. In Coolify versions that include stopped one-shot services in application health evaluation, mark `og-generator` as excluded from health checks in the Coolify service settings.

Run the generator manually with `docker compose run --rm og-generator`. For a local non-Docker run, set `OG_OUTPUT_DIR` to a writable directory before running `node scripts/generate-og-images.mjs`.

## ADRs

Architecture decision records live in [`docs/ADRs/`](docs/ADRs/).

## Running Locally

```bash
git clone https://github.com/vnglst/koenvangilst.nl.git
cd koenvangilst.nl
npm install
npm install --prefix zipline-sync
npm run dev
```

This starts the app, the OG image generator, and the local photography sync together. The OG generator writes hashed PNGs into `public/og` and watches its inputs. Photography sync uses the same `zipline-sync/sync.mjs` implementation as production, writes its manifest to `public/photos-data.json`, writes variants to `public/photos/`, and refreshes every ten minutes.

To enable photography sync, create the ignored local credentials file and fill in its values:

```bash
cp .env.zipline.example .env.zipline
```

If credentials are absent, development still starts and reports that photography sync is disabled. Existing generated photography data is retained. A failed refresh also retains the last successfully published manifest and its assets. Run `npm run sync:photos` for an immediate one-shot refresh.

Visit `http://localhost:3000` to see the site in development mode.

## Development Scripts

```bash
npm run dev          # Start Vite, OG watcher, and periodic photo sync (port 3000)
npm run sync:photos  # Refresh the local photography mirror once
npm run build        # Production build → dist/
npm run start        # Serve the production build and static assets (port 3000)
npm run preview      # Serve the production build on localhost (port 3000)
npm run type-check   # Oxlint TypeScript 7 type-check
npm run lint         # Oxlint + TypeScript 7 type-aware rules
npm run format       # Prettier + Oxlint auto-fix
npm run check        # Check formatting with Prettier
npm run test              # Vitest (single run)
npm run test:e2e          # Playwright end-to-end tests
npm run test:e2e:ui       # Playwright end-to-end tests with UI
npm run test:e2e:docker   # Playwright e2e tests against a Docker/Nginx container
npm run test:photos:docker # Run production photo-sync container with local credentials
npx vitest           # Vitest in watch mode
npm run knip         # Detect unused dependencies/exports
```

Vite uses polling on macOS to avoid exhausting the operating system's low default file-watcher limit. Linux and production builds retain native file watching.

## Validation & Pre-commit Checks

Before committing code changes, run:

```bash
npm run type-check  # Oxlint TypeScript 7 type-check
npm run lint        # Oxlint + TypeScript 7 type-aware rules
npm run test        # Vitest unit tests
```

Resolve failures before committing to prevent broken builds from being deployed.

**Exception**: When dependencies are not installed (e.g., in CI or lightweight environments), these checks may be skipped, but should be run in local development before pushing.

**E2E for large changes**: When making a large refactor or other broad change — especially routing changes, content rendering changes, image handling changes, shared layout updates, or cross-cutting UI work — ALSO run:

```bash
# Terminal 1: build and start the production preview
npm run build && npm run preview

# Terminal 2: bypass Playwright's automatic dev server
BASE_URL=http://127.0.0.1:3000 npm run test:e2e
```

For the most production-like validation (the Compose website and OG worker, Nginx reverse proxy, legacy redirects, CSP headers, and static asset serving), run:

```bash
npm run test:e2e:docker           # Build image, run container, and run e2e suite
```

To smoke-test the production photography container against Zipline, run `npm run test:photos:docker`. Compose reads `.env.zipline`, writes to the photography volume, and exercises the same image, command, paths, and sync implementation used by Coolify.

> **Important**: Always run e2e tests against a production **build** (`npm run build && npm run start` or `npm run test:e2e:docker`), never against the dev server (`npm run dev`). The dev server now also runs the local OG generator, but it still behaves differently from production for SSR and proxying and can produce false positives or false negatives.

Without `BASE_URL`, `playwright.config.ts` starts `npm run dev` or reuses a server on port 3000. Set `BASE_URL` explicitly for production validation and wait for the preview to be ready. To run a focused spec, use `BASE_URL=http://127.0.0.1:3000 npm run test:e2e -- e2e/layout-shift.spec.ts`.

Use the Playwright suite as a required regression check when a change affects multiple user flows. A Node preview does not include Nginx; use the Docker suite for proxy, CSP, redirects, and cache behavior.

**Husky pre-commit hook**: `.husky/pre-commit` automatically runs `npx lint-staged` (Oxlint + Prettier on staged files) and `npm run type-check`. Unit tests and E2E tests are NOT run automatically by the hook — run them manually before pushing.

## Updating Dependencies

Renovate is configured to update npm dependencies in the root project and subprojects, plus Node.js base images in Dockerfiles. Its two-day minimum release age matches npm's `min-release-age` protection. Install the Renovate GitHub App for this repository to enable automated update pull requests.

The project pins exact versions. The latest published versions may be newer than the two-day window, so installs may need a temporary override.

The scoped `postcss-selector-parser` override patches Tailwind Typography's build-time dependency until its upstream pin is updated.

1. **Root dependencies**: run the updater script.

   ```bash
   npm run update-deps
   ```

   If the install hangs or errors with `No matching version found for ... with a date before ...`, the chosen version is too fresh for `min-release-age`. Re-run the install with the override:

   ```bash
   npm install --no-audit --no-fund --min-release-age=0
   ```

2. **Sub-project dependencies**: `og-generator/` and `zipline-sync/` are not covered by the root updater. Check and update them manually:

   ```bash
   npm view <package> version
   npm install --prefix zipline-sync --no-audit --no-fund --min-release-age=0
   ```

3. **Docker base images**: check whether a newer Node Alpine tag is available and update all Dockerfiles (`Dockerfile`, `og-generator/Dockerfile`, `zipline-sync/Dockerfile`) together with the Node version mentions in this README.

4. **After upgrading**, run the standard validation suite:

   ```bash
   npm run type-check
   npm run lint
   npm run test
   npm run build
   npm run check
   npm run knip
   ```

   `knip` may print new "Configuration hints" after a major/minor upgrade (e.g. suggesting entries to remove from `ignoreDependencies` or `ignoreBinaries`). Apply those hints to keep `knip.json` current.

5. **Full regression**: dependency upgrades can change build output and runtime behavior. For the most production-like validation, run the Docker e2e suite before deploying:

   ```bash
   npm run test:e2e:docker
   ```

## Architecture

### Content / CMS

- Blog posts live in `content/*.mdx` with YAML frontmatter; the current content globs do not discover nested `index.mdx` files
- Per-post custom React components live in `content/[slug]/` directories and are imported directly in the MDX file with static `import`
- `@mdx-js/rollup` compiles MDX at build time (Vite processes all content files before bundling)
- `src/cms/posts-server.ts` - eagerly loads compiled MDX modules and validates post metadata on the server
- `src/cms/mdx-parser.ts` - lazily loads compiled MDX components and caches their React component identities
- Each MDX file exports: `default` (React component) + `frontmatter` (object, via `remark-mdx-frontmatter`)
- Schema validation via `src/cms/schema.ts` (Zod)
- **Why build-time MDX**: Vite compiles content before bundling, keeping request-time rendering fast and avoiding runtime file-system compilation.

### Routing (TanStack Router file-based)

- `src/routes/__root.tsx` — root layout, meta tags, FOUC-prevention theme script, Plausible tracking
- `src/routes/index.tsx` — home page
- `src/routes/lab/index.tsx` — blog/lab listing with `q` search param (client-side filter)
- `src/routes/lab/$slug.tsx` — individual MDX posts
- `src/routes/lab/gen-art-gallery/` — generative art iframe gallery
- `src/routes/lab/ons-land/` — D3 land-use hexbin chart
- `src/routes/lab/prognosis-2100/` — ECharts climate dashboard
- `src/routes/photography/` — photo gallery
- `src/routes/tag/$slug.tsx` — posts filtered by tag
- **Server routes** (API): `feed.xml.ts`, `health.ts`, `llm-context.ts`, `og.tsx`, `sitemap[.]xml.ts`
- **Legacy redirects**: handled by `src/lib/legacy-redirect.ts` through `src/server.ts`, with production redirects also in `nginx/nginx.conf`

TanStack Router generates `src/routeTree.gen.ts` automatically — never edit this file manually. Files/dirs prefixed with a single `_` are treated as non-route components (e.g. `_components/`, `_charts/`).

### Key Patterns

**`createServerFn`**: Route loaders that need server-only data use `createServerFn({ method: 'GET' }).handler(...)`. Route `loader:` calls the server fn. Component reads data with `Route.useLoaderData()`.

**`_components/` convention**: Files/folders prefixed with `_` (single) are excluded from route generation by `routeFileIgnorePattern: '^_(?!_)'` in vite.config.ts.

**`#/*` path alias**: Cross-module imports use `#/components/...`, `#/lib/...`, etc. The alias is configured in `tsconfig.json` (paths) and `package.json` (imports field). Relative imports are also used; `@/*` is not configured.

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
- **Base images**: Use `node:26.12.1-alpine` for production builds
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

The production Compose file exposes the website only on its internal Docker network, making
Coolify's proxy the sole public entry point. For local Compose access on `127.0.0.1:3000`, include
the local override:

```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml up website
```

### Production Container Architecture

The Docker image uses a multi-stage build (`Dockerfile`) with **Nginx as the reverse proxy** and **Node.js as the SSR backend**:

- **Nginx** listens on `0.0.0.0:80` inside the container and handles:
  - Static assets directly (client bundles, fonts, public files) with long cache headers
  - Public SSR HTML cached on the first request and retained across the container lifetime (up to the 256 MB cache limit); photography pages and XML feeds/sitemaps bypass this cache to keep live data fresh
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

On container startup, `docker-entrypoint.sh` starts the Node.js SSR server and Nginx. No image generation happens at website startup. Photography assets are generated by the separate `zipline-sync` container and served from the shared Docker volume mounted at `/data/photography`. Open Graph images are generated once per deployment by `og-generator` and served from `/data/og`. See `zipline-sync/` for the cron service that processes photos and writes the manifest.

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

### Deploying and Verifying Production

1. Run `npm run test`, `npm run type-check`, `npm run lint`, and `npm run knip`. Resolve failures before continuing.
2. Run `npm run build` to verify the production build. Run the Docker e2e suite before deploying broad changes or dependency upgrades, as described above.
3. Commit the intended changes and push the deployment branch to origin. Coolify builds and deploys the website on Hetzner; deployment typically takes about five minutes.
4. Verify these production endpoints after deployment:

   | Endpoint                                                     | Expected result                                        |
   | ------------------------------------------------------------ | ------------------------------------------------------ |
   | https://koenvangilst.nl                                      | 200 OK; footer commit hash matches the deployed commit |
   | https://koenvangilst.nl/lab                                  | 200 OK; listing renders                                |
   | https://koenvangilst.nl/lab/ai-and-the-future-of-engineering | 200 OK; article renders                                |
   | https://koenvangilst.nl/feed.xml                             | 200 OK; valid RSS XML                                  |
   | https://koenvangilst.nl/health                               | 200 OK; health check passes                            |

If verification fails, inspect the deployment and application logs, fix the issue locally, repeat validation, and redeploy.

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

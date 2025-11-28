# Copilot Instructions

## Philosophy

This project follows a strict self-hosting philosophy:

- **Minimize external dependencies**: Anything that can be self-hosted or done independently should be
- **Open source only**: All software components must be free and open source (FOSS)
- **Full control**: Preference for solutions that can be fully controlled and maintained without relying on third-party services

When suggesting solutions or improvements, prioritize self-hosted, open-source alternatives over managed services (e.g., no GitHub Actions for builds, no Vercel, no proprietary CDNs).

## Hosting Architecture

- **Production deployment**: Self-hosted on Hetzner Cloud CX33 (4 vCPU, 7.6GB RAM, x86_64/amd64)
- **Deployment platform**: Coolify v4 (self-hosted on separate Raspberry Pi 5)
- **Build process**: Docker builds run on Hetzner server (expect ~4min builds with Next.js 16 Turbopack)
- **Container runtime**: Docker Engine with BuildKit cache mounts for build optimization
- **Persistent cache**: `/data/cache` volume mounted for Next.js image optimization cache

## Development Environment

- **Local Docker**: Use only free and open source tooling (avoid proprietary services like Docker Desktop; prefer Colima)
- **Container runtime**: Colima on macOS - use commands like `colima start`/`colima stop` when documenting workflows
- **BuildKit**: Requires the open source `docker-buildx` CLI plugin - install via Homebrew (`brew install docker-buildx`)

## Deployment Target

- **Architecture**: linux/amd64 (Hetzner CX33 is x86_64, NOT ARM)
- **Base images**: Use `node:24-alpine` for production builds
- **Build optimization**: BuildKit cache mounts are configured for `/app/.next/cache` with persistent IDs
- **Expected build time**: ~4 minutes (3.7min Turbopack compilation + deps/checks) - this is normal for Next.js 16 on the server

### Coolify Configuration

The Dockerfile automatically uses Coolify's `COMMIT_SHA` environment variable to embed the git commit hash during build time. This is displayed in the footer of the website without any manual configuration required.

If you need to override this (e.g., for testing), you can set a custom build argument:
- **Build Argument**: `SOURCE_COMMIT`
- **Value**: Your custom commit hash

## Testing Docker Builds Locally

Before deploying to Coolify, test the Docker build locally:

### Build the image
```bash
docker build --build-arg SOURCE_COMMIT=$(git rev-parse HEAD) -t koenvangilst-test .
```

### Run the container
```bash
docker run -d -p 3000:3000 --name koenvangilst-test koenvangilst-test
```

### Check logs
```bash
docker logs koenvangilst-test
# Should show: "✓ Ready in XXXms"
```

### Test post-deployment script
```bash
docker exec koenvangilst-test node scripts/generate-images.mjs
# Should generate optimized images or skip if they exist
```

### Test image serving
```bash
curl -I http://localhost:3000/static/photography-optimized/Sweden-IMG_7734/original.webp
# Should return HTTP/1.1 200 OK with Content-Type: image/webp
```

### Cleanup
```bash
docker stop koenvangilst-test && docker rm koenvangilst-test
```

## Current Stack

- Next.js 16.0.1 (Turbopack for builds)
- React 19.2.0
- Node.js 24 (LTS)
- Docker multi-stage builds with standalone output
- Self-hosted analytics via Plausible (dynamic import to avoid SSR issues)

## Pre-commit Checks

**IMPORTANT**: Before committing code changes, ALWAYS run the following checks:

```bash
npm run type-check  # TypeScript type checking
npm run lint        # ESLint
npm run test        # Vitest tests
```

If any of these fail, fix the issues before committing. This ensures code quality and prevents broken builds from being deployed.

**Exception**: When dependencies are not installed (e.g., in CI or lightweight environments), these checks may be skipped, but should be run in local development before pushing.

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
- `/app/llm-context/route.ts` - Context resource that sends events to Plausible

## Writing Style

When writing or editing blog posts and documentation:

- **Punctuation**: Use regular hyphens (-) instead of em-dashes (—) for readability and simplicity
- **Example**: "No log parsing, no database queries - just a clean dashboard" ✅
- **Avoid**: "No log parsing, no database queries—just a clean dashboard" ❌

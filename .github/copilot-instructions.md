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

## Testing Docker Builds Locally

Before deploying to Coolify, test the Docker build locally:

### Build the image
```bash
docker build -t koenvangilst-test .
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


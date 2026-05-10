ARG SOURCE_COMMIT=unknown

# ---- deps stage: install all dependencies with cache ----
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# ---- builder stage: compile the app ----
FROM node:24-alpine AS builder
ARG SOURCE_COMMIT=unknown
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=cache,target=/app/node_modules/.cache \
    SOURCE_COMMIT=${SOURCE_COMMIT} npm run build

# ---- prod-deps stage: production-only deps (includes native addons) ----
FROM node:24-alpine AS prod-deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# ---- runner stage: lean production image ----
FROM node:24-alpine AS runner
WORKDIR /app

# Node.js listens on localhost:3001 (internal); Nginx listens on 0.0.0.0:3000 (external)
ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=127.0.0.1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser && \
    apk add --no-cache su-exec nginx && \
    mkdir -p /run/nginx /var/cache/nginx

# TanStack Start / Vinxi server output
COPY --from=builder --chown=appuser:nodejs /app/dist ./

# Public dir (source photos + runtime-generated photography-optimized volume mount point)
COPY --from=builder --chown=appuser:nodejs /app/public ./public

# Production node_modules (sharp, exif-reader, satori, resvg-js native addons)
COPY --from=prod-deps --chown=appuser:nodejs /app/node_modules ./node_modules

# Image generation scripts
COPY --from=builder --chown=appuser:nodejs /app/scripts ./scripts

# Nginx configuration (replaces default site)
COPY nginx/nginx.conf /etc/nginx/nginx.conf
RUN rm -f /etc/nginx/http.d/default.conf

# Entrypoint starts Node.js (background) then Nginx (foreground)
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

# Nginx answers /health directly — no Node.js round-trip
# start-period=90s accounts for image generation time on first deploy
HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/health || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

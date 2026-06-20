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
RUN SOURCE_COMMIT=${SOURCE_COMMIT} npm run build

# ---- prod-deps stage: production-only deps (includes native addons) ----
FROM node:24-alpine AS prod-deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# ---- OG generator: one-shot post-deployment worker ----
FROM node:24-alpine AS og-generator
WORKDIR /app

ENV NODE_ENV=production
ENV OG_OUTPUT_DIR=/data/og

COPY --from=prod-deps /app/node_modules ./node_modules
COPY scripts/generate-og-images.mjs ./scripts/generate-og-images.mjs
COPY src/lib/og-image.mjs ./src/lib/og-image.mjs
COPY content ./content
COPY public/fonts/IBMPlexSans-Bold.ttf ./public/fonts/IBMPlexSans-Bold.ttf
COPY public/avatar.jpg ./public/avatar.jpg

CMD ["node", "scripts/generate-og-images.mjs"]

# ---- runner stage: lean production image ----
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Note: PORT and HOSTNAME for Node.js are set inline in docker-entrypoint.sh
# to prevent container platforms (Coolify) from overriding them.

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser && \
    apk add --no-cache ca-certificates su-exec nginx && \
    mkdir -p /run/nginx /var/cache/nginx

# TanStack Start / Vinxi server output
COPY --from=builder --chown=appuser:nodejs /app/dist ./

# Public dir (icons, favicons, etc. - no photography originals, they live in Zipline)
COPY --from=builder --chown=appuser:nodejs /app/public ./public

# Production node_modules (no sharp/exif-reader; those are used only by zipline-sync)
COPY --from=prod-deps --chown=appuser:nodejs /app/node_modules ./node_modules
# The native renderer is needed only in the separate og-generator target.
RUN rm -rf node_modules/@resvg

# Nginx configuration (replaces default site)
COPY nginx/nginx.conf /etc/nginx/nginx.conf
RUN rm -f /etc/nginx/http.d/default.conf

# Entrypoint starts Node.js (background) then Nginx (foreground)
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

# Nginx answers /health directly — no Node.js round-trip
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/health || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

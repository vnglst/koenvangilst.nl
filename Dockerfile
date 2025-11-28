ARG COMMIT_SHA=unknown
ARG SOURCE_COMMIT=${COMMIT_SHA}
FROM node:24-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
	npm ci

FROM base AS builder
ARG COMMIT_SHA=unknown
ARG SOURCE_COMMIT=${COMMIT_SHA}
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./package.json

# Photos copied in runner stage only (not needed for build)
COPY . .

RUN --mount=type=cache,target=/app/.next/cache \
	--mount=type=cache,target=/app/node_modules/.cache \
	NEXT_TELEMETRY_DISABLED=1 SOURCE_COMMIT=${SOURCE_COMMIT} npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_CACHE_DIR=/data/cache

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN apk add --no-cache su-exec

# Next.js standalone output (order matters: standalone first, then public)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Source photos for post-deploy image generation
COPY public/static/photography ./public/static/photography
COPY --from=builder /app/scripts ./scripts

# Entrypoint fixes volume permissions at runtime
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set permissions for writable directories
RUN mkdir -p /app/public/static/photography-optimized && \
    chown -R nextjs:nodejs /app/public/static/photography-optimized
RUN mkdir -p .next && chown nextjs:nodejs .next
RUN mkdir -p ${NEXT_CACHE_DIR} && chown nextjs:nodejs ${NEXT_CACHE_DIR}

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/health || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "server.js"]

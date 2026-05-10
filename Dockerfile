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

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser
RUN apk add --no-cache su-exec

# TanStack Start / Vinxi server output
COPY --from=builder --chown=appuser:nodejs /app/dist ./

# Static assets (public dir is served by the Node.js server)
COPY --from=builder --chown=appuser:nodejs /app/public ./public

# Production node_modules (needed for sharp, exif-reader, satori, resvg-js native addons)
COPY --from=prod-deps --chown=appuser:nodejs /app/node_modules ./node_modules

# Image generation script
COPY --from=builder --chown=appuser:nodejs /app/scripts ./scripts

# Copy entrypoint and scripts
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/health || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node_modules/.bin/srvx", "--entry", "server/server.js"]

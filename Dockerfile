ARG SOURCE_COMMIT=unknown

# ---- shared Node.js base ----
FROM node:24-alpine AS base
WORKDIR /app

# ---- deps stage: install all build dependencies with cache ----
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# ---- prod-deps stage: install production dependencies directly ----
# This can run in parallel with the full install and avoids an expensive npm prune.
FROM base AS prod-deps
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --no-audit --no-fund

# ---- builder stage: compile the app ----
FROM deps AS builder
ARG SOURCE_COMMIT=unknown
COPY . .
RUN SOURCE_COMMIT=${SOURCE_COMMIT} npm run build

# ---- runner stage: lean production image ----
FROM base AS runner

ENV NODE_ENV=production
# Note: PORT and HOSTNAME for Node.js are set inline in docker-entrypoint.sh
# to prevent container platforms (Coolify) from overriding them.

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser && \
    apk add --no-cache ca-certificates su-exec nginx && \
    mkdir -p /run/nginx /var/cache/nginx

# Production node_modules
COPY --from=prod-deps --chown=appuser:nodejs /app/node_modules ./node_modules

# Nginx configuration (replaces default site)
COPY nginx/nginx.conf /etc/nginx/nginx.conf
RUN rm -f /etc/nginx/http.d/default.conf

# Entrypoint starts Node.js (background) then Nginx (foreground)
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Keep code-dependent layers last so normal deploys reuse the complete runtime base.
# TanStack Start / Vinxi server output
COPY --from=builder --chown=appuser:nodejs /app/dist ./

# Public dir (icons, favicons, etc. - no photography originals, they live in Zipline)
COPY --from=builder --chown=appuser:nodejs /app/public ./public

EXPOSE 80

# Nginx answers /health directly — no Node.js round-trip
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/health || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

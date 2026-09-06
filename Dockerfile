ARG SOURCE_COMMIT=unknown

# ---- shared Node.js base ----
FROM node:26-alpine AS base
WORKDIR /app

# ---- deps stage: install all build dependencies with cache ----
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# ---- builder stage: compile the app ----
FROM deps AS builder
ARG SOURCE_COMMIT=unknown
COPY . .
RUN SOURCE_COMMIT=${SOURCE_COMMIT} npm run build

# ---- runner stage: static Nginx site ----
FROM nginx:1.29-alpine AS runner

RUN mkdir -p /run/nginx /var/cache/nginx

# Nginx configuration (replaces default site)
COPY nginx/nginx.conf /etc/nginx/nginx.conf
RUN rm -f /etc/nginx/http.d/default.conf

# Keep code-dependent layers last so normal deploys reuse the complete runtime base.
# Pre-rendered HTML, client bundles, photography snapshot, and generated OG images.
COPY --from=builder /app/dist/client /usr/share/nginx/html

EXPOSE 80

# Nginx answers /health directly — no Node.js round-trip
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/health || exit 1

# Multi-stage build for optimal image size and build speed
ARG SOURCE_COMMIT=unknown
FROM node:24-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
	npm ci

# Rebuild the source code only when needed
FROM base AS builder
ARG SOURCE_COMMIT
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Copy image generation script and package metadata
COPY scripts/generate-images.mjs ./scripts/generate-images.mjs
COPY package.json ./package.json


# Copy source photos - this layer rebuilds if any photo changes
COPY public/static/photography ./public/static/photography

# Ensure the optimized directory exists for the volume mount
RUN mkdir -p ./public/static/photography-optimized

# Now copy the rest of the source code
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV SOURCE_COMMIT=${SOURCE_COMMIT}

# Build Next.js (prebuild already ran, so it will skip image generation)
RUN --mount=type=cache,target=/app/.next/cache \
	--mount=type=cache,target=/app/node_modules/.cache \
	npm run build

# Production image, copy all the files and run next
FROM base AS runner
ARG SOURCE_COMMIT
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_CACHE_DIR=/data/cache
ENV SOURCE_COMMIT=${SOURCE_COMMIT}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next
RUN mkdir -p ${NEXT_CACHE_DIR}
RUN chown nextjs:nodejs ${NEXT_CACHE_DIR}

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

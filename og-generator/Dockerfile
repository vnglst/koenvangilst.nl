FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV OG_OUTPUT_DIR=/data/og

COPY og-generator/package.json og-generator/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --no-audit --no-fund

COPY scripts/generate-og-images.mjs ./scripts/generate-og-images.mjs
COPY src/lib/og-image.mjs ./src/lib/og-image.mjs
COPY content ./content
COPY public/fonts/IBMPlexSans-Bold.ttf ./public/fonts/IBMPlexSans-Bold.ttf
COPY public/avatar.jpg ./public/avatar.jpg

CMD ["node", "scripts/generate-og-images.mjs"]

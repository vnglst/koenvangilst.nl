FROM node:26.13.1-alpine3.24@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5

WORKDIR /app

ENV NODE_ENV=production
ENV OG_OUTPUT_DIR=/data/og

COPY og-generator/package.json og-generator/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --no-audit --no-fund

COPY scripts/generate-og-images.mjs ./scripts/generate-og-images.mjs
COPY src/lib/og-image.mjs ./src/lib/og-image.mjs
COPY src/lib/og-source.ts ./src/lib/og-source.ts
COPY content ./content
COPY public/static ./public/static
COPY public/fonts/IBMPlexSans-Regular.ttf ./public/fonts/IBMPlexSans-Regular.ttf
COPY public/fonts/NimbusSansExtended-Bold.otf ./public/fonts/NimbusSansExtended-Bold.otf
COPY public/avatar.jpg ./public/avatar.jpg

CMD ["node", "scripts/generate-og-images.mjs"]

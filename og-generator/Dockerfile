FROM node:26.13.0-alpine3.24@sha256:8996bb5821d62a8fd9bb27c1cb07462f3fdce6e47d640c6a881ead0b064ce216

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

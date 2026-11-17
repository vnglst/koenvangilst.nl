FROM node:26.13.0-alpine3.24@sha256:8996bb5821d62a8fd9bb27c1cb07462f3fdce6e47d640c6a881ead0b064ce216

WORKDIR /app

RUN apk add --no-cache ca-certificates=20261020-r0

COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --no-audit --no-fund

COPY --chmod=755 sync.sh ./sync.sh
COPY sync.mjs ./sync.mjs
COPY crontab /etc/crontabs/root

RUN mkdir -p /data/photography/files

ENV PHOTOS_DATA_PATH=/data/photography/photos-data.json
ENV PHOTOS_OUTPUT_DIR=/data/photography/files
ENV PHOTOS_PUBLIC_BASE_URL=/photos

CMD ["crond", "-f", "-l", "8"]

FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache ca-certificates

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

FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache ca-certificates

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY sync.mjs sync.sh ./
RUN chmod +x sync.sh
COPY crontab /etc/crontabs/root

RUN mkdir -p /app/data

ENV PHOTOS_DATA_PATH=/app/data/photos-data.json

CMD ["crond", "-f", "-l", "8"]

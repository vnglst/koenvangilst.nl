# Zipline Photo Sync

A standalone service that polls a Zipline folder for original photos, generates responsive optimized variants (JPEG + WebP), and writes a local `photos-data.json` manifest plus image files into the website's shared Docker volume.

## Architecture

```
You (web UI) ──upload original──▶ Zipline folder: photography-originals
                                        │
                          ┌─────────────┘
                          ▼
              ┌─── cron (every 10 min) ───┐
              │                           │
              │  1. List originals folder  │
              │  2. Reconcile manifest     │
              │  3. Delete removed variants│
              │  4. For each changed photo:│
              │     - download original    │
              │     - hash original bytes  │
              │     - sharp → variants     │
              │     - write local files    │
              │     - read EXIF            │
              │  5. Merge + sort entries   │
              │  6. Write photos-data.json │
              └───────────────────────────┘
                                        │
                                        ▼
                    shared Docker volume: /data/photography
                                        │
                                        ▼
              koenvangilst.nl reads the local manifest and serves /photos/* directly
```

## Prerequisites

1. A running [Zipline](https://github.com/diced/zipline) instance (e.g. `https://files.koenvangilst.nl`)
2. One folder created in Zipline:
   - **photography-originals** — where you manually upload new photos
3. Your Zipline API token (Dashboard → avatar → Copy token)

## Original filename convention

The website does not infer photo metadata in the browser. `sync.mjs` reads each original file from Zipline, derives metadata once, and writes it into `photos-data.json`.

Location is derived from the original upload filename before the first `-`:

```text
Munich, Germany-IMG_9124.jpeg → location: Munich, Germany
Oslo, Norway-IMG_7851.jpeg    → location: Oslo, Norway
```

Zipline may display randomized stored filenames in its UI. That is fine as long as the API still exposes the original upload name as `originalName`. If Zipline only exposes the randomized name, the sync logs a warning and leaves `location` empty instead of showing the random ID as the place.

## Local Development

### 1. Create `.env.zipline`

```bash
ZIPLINE_URL=https://files.koenvangilst.nl
ZIPLINE_TOKEN=your-api-token-here
ZIPLINE_ORIGINALS_FOLDER_ID=abc123...
PHOTOS_DATA_PATH=./data/photos-data.json
PHOTOS_OUTPUT_DIR=./data/files
PHOTOS_PUBLIC_BASE_URL=/photos
```

To find the folder ID: visit your Zipline dashboard, open the originals folder, and copy the ID from the URL or use the API:

```bash
curl -H "Authorization: YOUR_TOKEN" https://files.koenvangilst.nl/api/user/folders
```

### 2. Install dependencies

```bash
cd zipline-sync
npm install
```

### 3. Dry run (no uploads)

```bash
node --env-file=.env.zipline sync.mjs --dry-run
```

### 4. Full run

```bash
node --env-file=.env.zipline sync.mjs
```

## CLI Flags

| Flag        | Description                                             |
| ----------- | ------------------------------------------------------- |
| `--dry-run` | Show what would be processed without uploading anything |
| `--rebuild` | Re-process ALL originals                                |

## Environment Variables

| Var                           | Required | Default              | Description                                      |
| ----------------------------- | -------- | -------------------- | ------------------------------------------------ |
| `ZIPLINE_URL`                 | yes      |                      | Zipline instance URL                             |
| `ZIPLINE_TOKEN`               | yes      |                      | API token                                        |
| `ZIPLINE_ORIGINALS_FOLDER_ID` | yes      |                      | Folder ID for manual original uploads            |
| `PHOTOS_DATA_PATH`            | no       | `./photos-data.json` | Manifest output path                             |
| `PHOTOS_OUTPUT_DIR`           | no       | `./data/files`       | Directory for generated JPEG/WebP variants       |
| `PHOTOS_PUBLIC_BASE_URL`      | no       | `/photos`            | Public URL prefix used in the generated manifest |

## Deploy via Coolify

1. Deploy the root `docker-compose.yml` in Coolify.
2. The `zipline-sync` service shares the named `photography-data` volume with the website service.
3. Add environment variables (set in Coolify dashboard, NOT in repo):
   - `ZIPLINE_URL`
   - `ZIPLINE_TOKEN`
   - `ZIPLINE_ORIGINALS_FOLDER_ID`
4. Deploy. The container runs Alpine's `crond` and invokes `sync.mjs` every 10 minutes.
5. Logs are available from the `zipline-sync` container logs.

### Changing the cron schedule

Edit `crontab` and redeploy. The format is standard cron:

```
*/10 * * * * /app/sync.sh   # every 10 minutes
0 * * * * /app/sync.sh      # every hour
```

## How idempotency works

- Each variant is written with a content hash in the filename: `<SafeName>-<hash>-<width>.<ext>` (e.g. `Munich-Germany-IMG_9124-a1b2c3d4e5f6-1920.webp`)
- The manifest stores `sourceHash`, `originalId`, and `originalSize` so unchanged originals are skipped
- If an original changes, the hash changes and browsers fetch new immutable URLs
- Only genuinely new or changed originals trigger variant generation

## Deleting photos

The originals folder is the source of truth. When an original photo is removed from `photography-originals`, the next sync run:

- removes that photo from `photos-data.json`
- deletes only the generated local variant files for that photo from `PHOTOS_OUTPUT_DIR`
- republishes the manifest so the website stops showing it

Cleanup is conservative: the script only deletes filenames referenced by the removed manifest entry. It does not delete unrelated files from the output directory.

Use `--dry-run` to preview cleanup without deleting files or publishing a new manifest.

## URL format

All URLs in `photos-data.json` use the local public base path, e.g. `/photos/Munich-Germany-IMG_9124-a1b2c3d4e5f6-1080.webp`. Nginx serves those files directly from the shared volume with `Cache-Control: public, max-age=31536000, immutable`.

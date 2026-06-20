# Zipline Photo Sync

A standalone service that polls a Zipline folder for new original photos, generates responsive optimized variants (JPEG + WebP), and publishes a `photos-data.json` manifest via a stable vanity short URL.

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
              │  4. For each new photo:    │
              │     - download original    │
              │     - sharp → variants     │
              │     - upload to optimized  │
              │     - read EXIF            │
              │  5. Merge + sort entries   │
              │  6. Upload photos-data.json│
              │  7. Update vanity URL      │
              └───────────────────────────┘
                                        │
                                        ▼
                    Zipline: /go/photos-data → latest photos-data.json
                                         │
                                         ▼
              koenvangilst.nl frontend fetches the manifest and renders direct Zipline image URLs
```

## Prerequisites

1. A running [Zipline](https://github.com/diced/zipline) instance (e.g. `https://files.koenvangilst.nl`)
2. Two folders created in Zipline:
   - **photography-originals** — where you manually upload new photos
   - **photography-optimized** — where the script uploads generated variants + photos-data.json
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
ZIPLINE_OPTIMIZED_FOLDER_ID=def456...
```

To find folder IDs: visit your Zipline dashboard, open each folder, and copy the ID from the URL or use the API:

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
| `--rebuild` | Re-process ALL originals (re-upload all variants)       |

## Environment Variables

| Var                           | Required | Default              | Description                                |
| ----------------------------- | -------- | -------------------- | ------------------------------------------ |
| `ZIPLINE_URL`                 | yes      |                      | Zipline instance URL                       |
| `ZIPLINE_TOKEN`               | yes      |                      | API token                                  |
| `ZIPLINE_ORIGINALS_FOLDER_ID` | yes      |                      | Folder ID for manual original uploads      |
| `ZIPLINE_OPTIMIZED_FOLDER_ID` | yes      |                      | Folder ID for generated variants           |
| `ZIPLINE_VANITY`              | no       | `photos-data`        | Vanity slug for photos-data.json short URL |
| `PHOTOS_DATA_PATH`            | no       | `./photos-data.json` | Local cache path                           |

## Deploy via Coolify

1. Create a new Coolify service pointing to this directory (`/zipline-sync`)
2. Set the build context to `zipline-sync/`
3. Add environment variables (set in Coolify dashboard, NOT in repo):
   - `ZIPLINE_URL`
   - `ZIPLINE_TOKEN`
   - `ZIPLINE_ORIGINALS_FOLDER_ID`
   - `ZIPLINE_OPTIMIZED_FOLDER_ID`
4. Deploy. The container runs Alpine's `crond` and invokes `sync.mjs` every 10 minutes.
5. Logs are at `/app/data/sync.log` inside the container.

### Changing the cron schedule

Edit `crontab` and redeploy. The format is standard cron:

```
*/10 * * * * /app/sync.sh   # every 10 minutes
0 * * * * /app/sync.sh      # every hour
```

## How idempotency works

- Each variant is uploaded with `originalName` = `<SafeName>-<width>.<ext>` (e.g. `Munich-Germany-IMG_9124-1920.webp`)
- Before uploading, the script lists the optimized folder and builds a map of `originalName → url`
- If a variant already exists, its URL is reused — no re-upload
- Only genuinely new originals trigger new uploads

## Deleting photos

The originals folder is the source of truth. When an original photo is removed from `photography-originals`, the next sync run:

- removes that photo from `photos-data.json`
- deletes only the generated variant files for that photo from `photography-optimized`
- republishes the manifest so the website stops showing it

Cleanup is conservative: the script only deletes filenames it can derive from the removed manifest entry, such as `Munich-Germany-IMG_9124-1080.webp` and `Munich-Germany-IMG_9124-original.jpg`. It does not delete unrelated files from the optimized folder.

Use `--dry-run` to preview cleanup without deleting files or publishing a new manifest.

## URL format

All URLs in `photos-data.json` are absolute Zipline URLs, e.g. `https://files.koenvangilst.nl/u/example.webp`. The main website does not proxy images; browsers load optimized variants directly from `files.koenvangilst.nl`.

# ADR 0001: Move photography processing to Zipline sync

Status: accepted

## Context

The main website previously handled photography asset generation itself. That kept image processing inside the app container and tied the gallery to startup-time work that was harder to isolate and operate.

## Decision

Move photography processing into a standalone `zipline-sync/` service. Originals are uploaded to Zipline's `photography-originals` folder, the sync job generates hashed optimized variants and a `photos-data.json` manifest into the website's shared `photography-data` Docker volume, and the main site consumes the local manifest and serves the files from `/photos/*`.

## Consequences

- The website container no longer generates photography derivatives at startup.
- Photo processing can be scheduled and operated independently from website serving.
- Zipline becomes the source of truth for originals only.
- Optimized derivatives live in the shared Docker volume so the website can keep serving the last successful sync if Zipline is down.
- Local setup now requires Zipline credentials plus the originals folder ID in `.env.zipline`.

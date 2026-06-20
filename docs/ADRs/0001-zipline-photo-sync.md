# ADR 0001: Move photography processing to Zipline sync

Status: accepted

## Context

The main website previously handled photography asset generation itself. That kept image processing inside the app container and tied the gallery to startup-time work that was harder to isolate and operate.

## Decision

Move photography processing into a standalone `zipline-sync/` service. Originals are uploaded to Zipline's `photography-originals` folder, the sync job generates optimized variants and a `photos-data.json` manifest in `photography-optimized`, and the main site consumes the manifest and renders direct Zipline URLs.

## Consequences

- The website container no longer generates or stores photography derivatives.
- Photo processing can be scheduled and operated independently in Coolify.
- Zipline becomes the source of truth for originals and generated assets.
- Local setup now requires Zipline credentials plus the two folder IDs in `.env.zipline`.

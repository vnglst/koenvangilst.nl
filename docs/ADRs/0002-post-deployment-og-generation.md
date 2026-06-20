# ADR 0002: Generate Open Graph images after deployment

Status: accepted

## Context

The website build generated every Open Graph image into `public/og`. This increased build time and tied image rendering to deployment readiness, even when most images had not changed.

## Decision

Run Open Graph rendering in a one-shot `og-generator` Compose service after the website becomes healthy. The generator and website share a persistent `og-data` volume with read/write and read-only access respectively. Image filenames contain a deterministic content hash, and a manifest allows unchanged images to be skipped.

Nginx serves generated images with immutable caching. Missing images receive a non-cacheable fallback while generation is in progress. Old hashed files are retained so previously published URLs remain valid.

## Consequences

- Website builds and readiness no longer wait for image rendering.
- Changed metadata produces a new cache-safe URL.
- The shared volume must be included in backups and may eventually need manual pruning.
- A fresh deployment can briefly return the fallback image.

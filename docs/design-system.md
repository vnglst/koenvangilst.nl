# Design notes

Use `/design-system` for live components and theme examples. Shared styles remain in `src/styles/colophon.css`; the filename is retained from the earlier design to avoid import churn.

- The theme defaults to the operating system preference. The button switches between light and dark; the choice is stored locally and applied before hydration.
- The photography column can extend to the right of the reading frame, but its sidebar must keep the same position as on writing pages.
- Artwork stays hosted on its original sites; do not vendor third-party projects here.
- `NimbusSansExtended-Bold.otf` is an uncompressed copy of the existing Nimbus WOFF2 for the OG renderer, which cannot load WOFF2. Web pages continue using WOFF2.
- When changing the OG template, bump `OG_TEMPLATE_VERSION` and regenerate `public/og/fallback.png`. Existing hashed OG files remain valid and must not be removed.

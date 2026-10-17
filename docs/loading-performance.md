# Loading performance

Measured on October 17, 2026 against baseline commit `c4459a6` and the font preload change. Raw samples and environment settings are in [loading-benchmark.json](loading-benchmark.json).

## Before and after

Three samples per page, each in a fresh Chromium context at 390 x 844. Both production builds ran locally. A shared response budget of 1.6 Mbit/s and 100 ms request latency makes unnecessary downloads visible even on loopback. External requests, including analytics and speculative links to production, were blocked.

| Page    | Local resources before |     After | Reduction | Median LCP before |    After |
| ------- | ---------------------: | --------: | --------: | ----------------: | -------: |
| Home    |              786,972 B | 640,936 B |     18.6% |          2,124 ms | 1,492 ms |
| Lab     |              789,177 B | 643,141 B |     18.5% |          2,712 ms | 1,764 ms |
| Article |              845,119 B | 768,503 B |      9.1% |          3,580 ms | 2,728 ms |

The article sample is `/lab/ai-and-the-future-of-engineering`. Sizes are decoded local resources, excluding HTML. Font bytes dropped from 311,408 B to 165,584 B on Home and Lab, and to 235,004 B on the article. Small additional JavaScript savings come from removing the preload declarations from the root component.

These are synthetic local results, not production Core Web Vitals or estimates for every visitor. The Node preview serves uncompressed assets; production Nginx compresses text assets. Font WOFF2 files are already compressed. Request scheduling varies between samples, so timing comparisons use medians and regression tests enforce resource budgets rather than tight timing limits.

## Changes and experiments

The root document now preloads the regular body face, semibold headings, and Nimbus display face. IBM Plex Sans 500 and 700 remain available in CSS and load only where used. The article's bold text still requests weight 700. Home and Lab avoid downloading both unused weights without changing typography.

A second experiment imported only MDX frontmatter in the server metadata module. It left the server bundle essentially unchanged (2,201 KB versus 2,200 KB), so it was discarded. The lazy MDX component cache and page loading boundaries are unchanged.

## Regression coverage and reproduction

Build and start a fresh production preview before running Playwright:

```sh
npm run build
PORT=3103 npm run preview
```

In another terminal:

```sh
BASE_URL=http://127.0.0.1:3103 npm run test:e2e -- e2e/loading-performance.spec.ts e2e/layout-shift.spec.ts --workers=1
```

For repeated samples with the constrained response budget:

```sh
LOADING_BENCHMARK=1 BASE_URL=http://127.0.0.1:3103 npm run test:e2e -- e2e/loading-performance.spec.ts --workers=1 --repeat-each=3
```

Each test attaches a `loading-metrics` JSON record containing TTFB, FCP, LCP, CLS, resource bytes, font bytes and requested scripts/fonts. The normal suite enforces decoded resource and font budgets on all three pages, protects lazy article/chart loading, checks that resource timing reports nonzero sizes, and checks CLS below 0.1. All three budget tests were also run against the original production build and failed on its excess font bytes.

Use `npm run test:e2e:docker` for the full suite with Nginx and photography fixtures. A plain Node preview without the photography manifest cannot pass the photography tests or the Nginx cache test.

## Validation results

- Production build, type checks, lint, 44 unit tests, Knip, changed-file formatting and diff checks passed.
- All six focused loading/layout-shift tests passed; constrained-bandwidth mode also passed all three pages.
- The full Docker/Nginx suite passed 89 tests, skipped five, and failed two existing Prognosis chart image-restoration checks (390 px and 1440 px). Both failures were reproduced against the unmodified baseline build.
- The plain Node suite passed 77 tests, skipped five and failed 14, including the same chart checks, photography tests without their manifest, and the Nginx-only cache assertion. The Docker run supplies the photography fixtures and passes those checks.

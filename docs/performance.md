# Build and loading benchmark

Measured on 2026-10-17 against `c4459a6`, using macOS arm64 and Node 26.10.0. These are local production-build measurements, not Hetzner deployment timings.

## Results

| Measurement                           |          Before |           After |       Change |
| ------------------------------------- | --------------: | --------------: | -----------: |
| Production build median, 3 runs       |        2,051 ms |        1,795 ms | 12.5% faster |
| Climate dashboard decoded JavaScript  | 1,605,266 bytes | 1,188,161 bytes |   26.0% less |
| Climate dashboard JavaScript requests |              19 |              12 |      7 fewer |
| Homepage decoded JavaScript           |   407,424 bytes |   407,424 bytes |    unchanged |
| Lab decoded JavaScript                |   409,312 bytes |   409,312 bytes |    unchanged |
| Article decoded JavaScript            |   427,216 bytes |   427,216 bytes |    unchanged |

The initial production build took 4.17 seconds; subsequent initial runs took 2.82 and 2.64 seconds. To reduce filesystem warm-up and path differences in the final comparison, both versions were then benchmarked sequentially in the same working directory with dependencies installed and no competing test suites. Before samples: 2,150 / 2,051 / 2,043 ms. After samples: 1,804 / 1,774 / 1,795 ms. Every sample starts a new Vite process and rebuilds both environments. This does not measure dependency installation or a cold Docker build.

Browser measurements use fresh Playwright contexts against the Node production preview, with fixture-backed climate data. Decoded resource sizes describe JavaScript the browser processes, not compressed network transfer. The dashboard's observed ready time was 154 ms before and 162 ms after in the initial local samples; this small difference is noisy and does not establish a latency improvement. Reduced payload and request counts are the reliable loading improvements measured here.

## Changes

- Reuse identical MDX compiler output between client and SSR builds. The cache lives only inside one Vite invocation and includes the module ID and source text. Changed content recompiles, and separate builds start empty. React's existing lazy MDX component cache is preserved.
- Load a dedicated chart initializer asynchronously, with static named ECharts imports inside it. This allows unused chart types, components and the SVG renderer to be removed, while keeping chart code out of ordinary pages. Register the supported chart features once per module load.
- An experiment importing only MDX frontmatter did not materially reduce server output and was removed.

## Reproduce

```bash
npm ci --no-audit --no-fund
npm run benchmark:build
# Optional: BUILD_BENCHMARK_RUNS=5 npm run benchmark:build
npm run preview -- --port 4318
```

In another terminal, explicitly target that production preview:

```bash
BASE_URL=http://127.0.0.1:4318 npx playwright test e2e/performance.spec.ts e2e/layout-shift.spec.ts --workers=1
```

The performance spec attaches JSON measurements for each route. It limits the dashboard to 1,250,000 decoded script bytes and 14 script requests, and ordinary pages to 460,000 bytes and 20 requests. The dashboard budget was verified to fail against the unchanged build (1,605,266 bytes) and pass after optimization. Timings remain diagnostic to avoid machine-dependent failures. Unit tests protect reuse, content invalidation, distinct module IDs and cache isolation across builds.

## Validation

- Type checking, lint, all 46 unit tests, Knip, changed-file formatting and whitespace checks pass.
- All four performance budgets and all three layout-shift checks pass against the production preview. Climate article heatmaps and chart typography checks pass at phone and desktop widths.
- Full Docker/Nginx suite: 91 passed, 5 skipped, 1 failed. The failing test is `Prognosis updates all three charts and restores them at 390px`, which compares restored canvas pixels. The same restoration assertion fails on unchanged source; a fresh unchanged Node preview reproduced the 390px failure while the 1440px case passed. No assertion was weakened to hide it.
- A full Node-preview suite was stopped after missing local photography data caused unrelated failures. The Docker run supplies photography fixtures and passes those flows, including keyboard navigation, deep links and swipe navigation.

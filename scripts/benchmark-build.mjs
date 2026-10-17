import { spawnSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';

const runs = Number(process.env.BUILD_BENCHMARK_RUNS ?? 3);
if (!Number.isInteger(runs) || runs < 1) throw new Error('BUILD_BENCHMARK_RUNS must be a positive integer');
const samples = [];
for (let run = 1; run <= runs; run++) {
  const start = performance.now();
  const result = spawnSync('npm', ['run', 'build'], { encoding: 'utf8' });
  if (result.status !== 0) {
    process.stderr.write(result.stdout);
    process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }
  samples.push(Math.round(performance.now() - start));
  console.log(`Build ${run}/${runs}: ${samples.at(-1)} ms`);
}
const sorted = [...samples].sort((a, b) => a - b);
const middle = Math.floor(sorted.length / 2);
const medianMs = sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
console.log(
  JSON.stringify(
    { node: process.version, platform: process.platform, arch: process.arch, samplesMs: samples, medianMs },
    null,
    2
  )
);

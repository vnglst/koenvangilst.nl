#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const pkgPath = resolve(root, 'package.json');

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };

console.log('Fetching latest versions for all dependencies...\n');

const updates = [];
for (const [name, current] of Object.entries(deps)) {
  const latest = execSync(`npm view ${name} version`, { encoding: 'utf8' }).trim();
  const marker = latest === current ? ' ' : '*';
  console.log(`${marker} ${name.padEnd(40)} ${current} -> ${latest}`);
  if (latest !== current) updates.push([name, latest]);
}

if (updates.length === 0) {
  console.log('\nEverything is already up to date.');
  process.exit(0);
}

console.log(`\n${updates.length} package(s) to update.`);
console.log('Writing package.json...');
for (const [name, latest] of updates) {
  if (name in pkg.dependencies) pkg.dependencies[name] = latest;
  else if (name in pkg.devDependencies) pkg.devDependencies[name] = latest;
}
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

console.log('Installing dependencies (npm enforces min-release-age)...\n');
execSync('npm i', { stdio: 'inherit', cwd: root });

console.log('\nDone. Run type-check / lint / tests to verify.');

import { spawn } from 'node:child_process';
import path from 'node:path';

const port = '3000';
const generatorScript = path.join(process.cwd(), 'scripts/generate-og-images.mjs');
const viteScript = path.join(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');

function spawnProcess(command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
    ...options
  });

  child.on('error', (error) => {
    console.error(error);
    process.exit(1);
  });

  return child;
}

function waitForExit(child) {
  return new Promise((resolve) => {
    child.once('exit', (code, signal) => {
      resolve({ code, signal });
    });
  });
}

function stopChild(child) {
  if (!child.killed) {
    child.kill('SIGTERM');
  }
}

async function main() {
  const initialGenerator = spawnProcess(process.execPath, [generatorScript]);
  const initialResult = await waitForExit(initialGenerator);
  if (initialResult.code !== 0) {
    process.exit(initialResult.code ?? 1);
  }

  const watchGenerator = spawnProcess(process.execPath, [generatorScript, '--watch', '--skip-initial']);
  const vite = spawnProcess(process.execPath, [viteScript, 'dev', '--port', port]);
  const children = [watchGenerator, vite];

  const cleanup = () => {
    for (const child of children) {
      stopChild(child);
    }
  };

  process.once('SIGINT', cleanup);
  process.once('SIGTERM', cleanup);

  const firstExit = await Promise.race(
    children.map((child) => waitForExit(child).then((result) => ({ child, ...result })))
  );
  cleanup();

  if (firstExit.signal) {
    process.exit(0);
  }

  process.exit(firstExit.code ?? 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

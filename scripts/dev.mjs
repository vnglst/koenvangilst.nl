import { spawn } from 'node:child_process';
import path from 'node:path';
import { createLocalPhotoSyncEnvironment, runLocalPhotoSync } from './local-photo-sync.mjs';

const port = '3000';
const viteArguments = process.argv.slice(2);
const photoSyncIntervalMs = 10 * 60 * 1000;
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
  const photoSync = createLocalPhotoSyncEnvironment();
  const initialGenerator = spawnProcess(process.execPath, [generatorScript]);
  const initialResult = await waitForExit(initialGenerator);
  if (initialResult.code !== 0) {
    process.exit(initialResult.code ?? 1);
  }

  const watchGenerator = spawnProcess(process.execPath, [generatorScript, '--watch', '--skip-initial']);
  const vite = spawnProcess(process.execPath, [viteScript, 'dev', '--port', port, ...viteArguments], {
    env: {
      ...process.env,
      PHOTOS_MANIFEST_PATH: photoSync.environment.PHOTOS_DATA_PATH
    }
  });
  const children = [watchGenerator, vite];
  let activePhotoSync = null;

  const syncPhotos = () => {
    if (activePhotoSync) return;
    activePhotoSync = runLocalPhotoSync(photoSync.environment);
    activePhotoSync.once('error', (error) => {
      console.error('[photos] Failed to start local sync:', error);
    });
    activePhotoSync.once('exit', (code) => {
      if (code !== 0) {
        console.warn('[photos] Sync failed; keeping the last successful local data.');
      }
      activePhotoSync = null;
    });
  };

  let photoSyncTimer = null;
  if (photoSync.missing.length > 0) {
    console.warn(`[photos] Local sync disabled. Missing: ${photoSync.missing.join(', ')}`);
    console.warn('[photos] Create .env.zipline from .env.zipline.example to enable it.');
  } else {
    syncPhotos();
    photoSyncTimer = setInterval(syncPhotos, photoSyncIntervalMs);
  }

  const cleanup = () => {
    if (photoSyncTimer) clearInterval(photoSyncTimer);
    if (activePhotoSync) stopChild(activePhotoSync);
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

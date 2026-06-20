import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { loadEnvFile } from 'node:process';

const REQUIRED_VARIABLES = ['ZIPLINE_URL', 'ZIPLINE_TOKEN', 'ZIPLINE_ORIGINALS_FOLDER_ID'];

export function createLocalPhotoSyncEnvironment() {
  const envFile = path.join(process.cwd(), '.env.zipline');
  if (existsSync(envFile)) {
    loadEnvFile(envFile);
  }

  const missing = REQUIRED_VARIABLES.filter((name) => !process.env[name]);
  const environment = {
    ...process.env,
    PHOTOS_DATA_PATH: path.join(process.cwd(), 'public/photos-data.json'),
    PHOTOS_OUTPUT_DIR: path.join(process.cwd(), 'public/photos'),
    PHOTOS_PUBLIC_BASE_URL: '/photos'
  };

  return { environment, missing };
}

export function runLocalPhotoSync(environment) {
  return spawn(process.execPath, [path.join(process.cwd(), 'zipline-sync/sync.mjs')], {
    cwd: process.cwd(),
    env: environment,
    stdio: 'inherit'
  });
}

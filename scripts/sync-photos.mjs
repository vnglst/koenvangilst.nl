import { createLocalPhotoSyncEnvironment, runLocalPhotoSync } from './local-photo-sync.mjs';

const { environment, missing } = createLocalPhotoSyncEnvironment();

if (missing.length > 0) {
  console.error(`Photo sync is not configured. Missing: ${missing.join(', ')}`);
  console.error('Create .env.zipline from .env.zipline.example and add your Zipline credentials.');
  process.exit(1);
}

const child = runLocalPhotoSync(environment);
child.once('error', (error) => {
  console.error(error);
  process.exit(1);
});
child.once('exit', (code, signal) => {
  process.exit(signal ? 1 : (code ?? 1));
});

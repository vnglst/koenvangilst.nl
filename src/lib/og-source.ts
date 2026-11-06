import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';

const staticDir = resolve('public/static');

export function getOgSourcePath(src?: string) {
  if (!src?.startsWith('/static/')) return undefined;
  const file = resolve(staticDir, src.slice('/static/'.length));
  return file.startsWith(staticDir + sep) ? file : undefined;
}

export function readOgSource(src?: string) {
  const file = getOgSourcePath(src);
  if (!file) return undefined;

  try {
    const bytes = readFileSync(file);
    return { bytes, digest: createHash('sha256').update(bytes).digest('hex') };
  } catch {
    return undefined;
  }
}

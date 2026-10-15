import { afterEach, expect, test, vi } from 'vitest';

const { readFile } = vi.hoisted(() => ({ readFile: vi.fn() }));
vi.mock('node:fs/promises', () => ({ readFile }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.resetModules();
  vi.clearAllMocks();
});

test('local previews use the synced photo manifest without contacting the retired endpoint', async () => {
  vi.stubEnv('PHOTOS_MANIFEST_PATH', '');
  vi.stubEnv('ZIPLINE_PHOTOS_DATA_URL', '');
  readFile.mockResolvedValue(
    JSON.stringify([{ id: 1, src: '/photos/photo.jpg', srcSet: '/photos/photo.jpg 1080w', srcSetWebp: '' }])
  );
  const fetch = vi.fn();
  vi.stubGlobal('fetch', fetch);
  const { getPhotos } = await import('./photos');
  expect(await getPhotos()).toEqual([expect.objectContaining({ id: 1, src: '/photos/photo.jpg' })]);
  expect(readFile).toHaveBeenCalledWith('public/photos-data.json', 'utf8');
  expect(fetch).not.toHaveBeenCalled();
});

test('the production manifest override takes precedence over a remote manifest', async () => {
  vi.stubEnv('PHOTOS_MANIFEST_PATH', '/data/photography/photos-data.json');
  vi.stubEnv('ZIPLINE_PHOTOS_DATA_URL', 'https://example.com/manifest');
  readFile.mockResolvedValue('[]');
  vi.stubGlobal('fetch', vi.fn());
  const { getPhotos } = await import('./photos');
  await getPhotos();
  expect(readFile).toHaveBeenCalledWith('/data/photography/photos-data.json', 'utf8');
  expect(fetch).not.toHaveBeenCalled();
});

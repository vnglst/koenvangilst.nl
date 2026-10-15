import { expect, test } from 'vitest';
import { getLegacyRedirect } from './legacy-redirect';

test('historical section URLs preserve their article destination', () => {
  for (const section of ['blog', 'portfolio', 'clients', 'labs', 'snippets', 'projects']) {
    expect(getLegacyRedirect(`/${section}`)).toEqual({ location: '/lab', status: 301 });
    expect(getLegacyRedirect(`/${section}/`)).toEqual({ location: '/lab', status: 301 });
    expect(getLegacyRedirect(`/${section}/jwt-token`)).toEqual({ location: '/lab/jwt-token', status: 301 });
  }
});
test('legacy feed and photo URLs retain their special destinations', () => {
  expect(getLegacyRedirect('/blog/feed')).toEqual({ location: '/feed.xml', status: 301 });
  expect(getLegacyRedirect('/photography/photo/14')).toEqual({ location: '/photography', status: 302 });
});
test('current routes and unrelated prefixes are left alone', () => {
  for (const path of ['/', '/lab', '/photography/14', '/blogger', '/api/co2']) {
    expect(getLegacyRedirect(path)).toBeUndefined();
  }
});

test('retired CO2 demo points to the preserved article', () => {
  for (const path of ['/lab/co2', '/lab/co2/']) {
    expect(getLegacyRedirect(path)).toEqual({ location: '/lab/aranet4-co2-monitor', status: 301 });
  }
});

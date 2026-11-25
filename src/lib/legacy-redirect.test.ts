import { expect, test } from 'vitest';
import { getLegacyRedirect } from './legacy-redirect';

test('former Lab article URLs move permanently to Articles', () => {
  expect(getLegacyRedirect('/lab/jwt-token')).toEqual({ location: '/articles/jwt-token', status: 301 });
  expect(getLegacyRedirect('/lab/jwt-token/')).toEqual({ location: '/articles/jwt-token', status: 301 });
  expect(getLegacyRedirect('/lab/jwt-token', '?ref=x')).toEqual({ location: '/articles/jwt-token?ref=x', status: 301 });
});

test('Lab projects stay in the Lab and their introductions point to them directly', () => {
  for (const project of ['gen-art-gallery', 'ons-land', 'prognosis-2100']) {
    expect(getLegacyRedirect(`/lab/${project}`)).toBeUndefined();
    expect(getLegacyRedirect(`/lab/${project}-project`)).toEqual({ location: `/lab/${project}`, status: 301 });
    expect(getLegacyRedirect(`/projects/${project}`)).toEqual({ location: `/lab/${project}`, status: 301 });
  }
});

test('former Lab filters move to the matching page', () => {
  expect(getLegacyRedirect('/lab', '?q=side-project')).toEqual({ location: '/lab', status: 301 });
  expect(getLegacyRedirect('/lab', '?q=snippet')).toEqual({ location: '/articles?q=snippet', status: 301 });
  expect(getLegacyRedirect('/lab', '?q=article')).toEqual({ location: '/articles?q=article', status: 301 });
});

test('historical section URLs reach their current destination in one redirect', () => {
  for (const section of ['blog', 'portfolio', 'clients', 'labs', 'snippets', 'projects']) {
    const index = ['portfolio', 'projects'].includes(section) ? '/lab' : '/articles';
    expect(getLegacyRedirect(`/${section}`)).toEqual({ location: index, status: 301 });
    expect(getLegacyRedirect(`/${section}/`)).toEqual({ location: index, status: 301 });
    expect(getLegacyRedirect(`/${section}/jwt-token`)).toEqual({ location: '/articles/jwt-token', status: 301 });
  }
});

test('legacy feed and photo URLs retain their special destinations', () => {
  expect(getLegacyRedirect('/blog/feed')).toEqual({ location: '/feed.xml', status: 301 });
  expect(getLegacyRedirect('/photography/photo/14')).toEqual({ location: '/photography', status: 302 });
});

test('current routes and unrelated prefixes are left alone', () => {
  for (const path of ['/', '/lab', '/articles', '/articles/jwt-token', '/photography/14', '/blogger', '/api/co2']) {
    expect(getLegacyRedirect(path)).toBeUndefined();
  }
});

test('retired CO2 demo points to the preserved article', () => {
  for (const path of ['/lab/co2', '/lab/co2/', '/blog/co2']) {
    expect(getLegacyRedirect(path)).toEqual({ location: '/articles/aranet4-co2-monitor', status: 301 });
  }
});

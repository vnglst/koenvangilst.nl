import { describe, expect, it } from 'vitest';

import {
  createFallbackOgImage,
  createHomeOgImage,
  createPostOgImage,
  createTagOgImage,
  hashOgSignature
} from './og-image.mjs';

describe('OG image addresses', () => {
  it('creates deterministic content-addressed post filenames', () => {
    const input = { slug: 'example', title: 'An example', description: 'A summary' };

    expect(createPostOgImage(input)).toEqual(createPostOgImage(input));
    expect(createPostOgImage(input).filename).toMatch(/^example-[a-f0-9]{12}\.png$/);
    expect(createPostOgImage({ ...input, title: 'Changed' }).filename).not.toBe(createPostOgImage(input).filename);
  });

  it('includes tag post counts in the address', () => {
    const onePost = createTagOgImage({ slug: 'typescript', tag: 'typescript', postCount: 1 });
    const twoPosts = createTagOgImage({ slug: 'typescript', tag: 'typescript', postCount: 2 });

    expect(onePost.description).toBe('1 post about typescript');
    expect(twoPosts.description).toBe('2 posts about typescript');
    expect(onePost.filename).not.toBe(twoPosts.filename);
  });

  it('creates a hashed home URL', () => {
    expect(createHomeOgImage().url).toMatch(/^\/og\/home-[a-f0-9]{12}\.png$/);
  });

  it('creates a stable fallback URL', () => {
    expect(createFallbackOgImage()).toEqual(createFallbackOgImage());
    expect(createFallbackOgImage().url).toBe('/og/fallback.png');
    expect(createFallbackOgImage().filename).toBe('fallback.png');
  });

  it('hashes unicode text deterministically', () => {
    expect(hashOgSignature('héllo')).toBe(hashOgSignature('héllo'));
    expect(hashOgSignature('héllo')).not.toBe(hashOgSignature('hello'));
  });
});

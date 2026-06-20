export type OgImage = {
  description: string;
  filename: string;
  signature: string;
  title: string;
  url: string;
};

export const OG_TEMPLATE_VERSION: string;
export const HOME_OG_TITLE: string;
export const HOME_OG_DESCRIPTION: string;

export function hashOgSignature(value: string): string;
export function createOgImage(input: {
  type: 'home' | 'blog' | 'tag';
  slug: string;
  title: string;
  description: string;
}): OgImage;
export function createHomeOgImage(): OgImage;
export function createPostOgImage(input: { slug: string; title: string; description: string }): OgImage;
export function createTagOgImage(input: { slug: string; tag: string; postCount: number }): OgImage;

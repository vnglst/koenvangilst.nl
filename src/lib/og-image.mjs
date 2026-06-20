export const OG_TEMPLATE_VERSION = 'v9-dark-avatar-gradient-fontfix';

export const HOME_OG_TITLE = 'Koen van Gilst';
export const HOME_OG_DESCRIPTION =
  'Principal Engineer at Rabobank with a background in philosophy and lifelong passion for programming.';

/**
 * FNV-1a provides a small, deterministic content fingerprint that works in
 * both Node.js and the browser. It is an address, not a security boundary.
 */
export function hashOgSignature(value) {
  let hash = 0xcbf29ce484222325n;
  const bytes = new TextEncoder().encode(value);

  for (const byte of bytes) {
    hash ^= BigInt(byte);
    hash = BigInt.asUintN(64, hash * 0x100000001b3n);
  }

  return hash.toString(16).padStart(16, '0').slice(0, 12);
}

export function createOgImage({ type, slug, title, description }) {
  const prefix = type === 'home' ? 'home' : type === 'tag' ? `tag-${slug}` : slug;
  const signature = [OG_TEMPLATE_VERSION, type, slug, title, description].join('\n');
  const filename = `${prefix}-${hashOgSignature(signature)}.png`;

  return {
    description,
    filename,
    signature,
    title,
    url: `/og/${filename}`
  };
}

export function createHomeOgImage() {
  return createOgImage({
    type: 'home',
    slug: 'home',
    title: HOME_OG_TITLE,
    description: HOME_OG_DESCRIPTION
  });
}

export function createPostOgImage({ slug, title, description }) {
  return createOgImage({ type: 'blog', slug, title, description });
}

export function createTagOgImage({ slug, tag, postCount }) {
  return createOgImage({
    type: 'tag',
    slug,
    title: `Posts about ${tag}`,
    description: `${postCount} post${postCount === 1 ? '' : 's'} about ${tag}`
  });
}

import { expect, test, vi } from 'vitest';
import { cacheMdx } from '../../scripts/lib/cache-mdx';

test('shares compilation across environments but recompiles edited MDX', async () => {
  const transform = vi.fn(async (source: string) => ({ code: source }));
  const plugin = cacheMdx({ name: 'mdx', config: () => undefined, transform });
  expect(await plugin.transform('first', '/post.mdx')).toEqual({ code: 'first' });
  expect(await plugin.transform('first', '/post.mdx')).toEqual({ code: 'first' });
  expect(transform).toHaveBeenCalledTimes(1);
  expect(await plugin.transform('edited', '/post.mdx')).toEqual({ code: 'edited' });
  expect(transform).toHaveBeenCalledTimes(2);
  await plugin.transform('edited', '/other.mdx');
  expect(transform).toHaveBeenCalledTimes(3);
});

test('does not cache other transforms or share results across builds', async () => {
  const transform = vi.fn(async (source: string) => ({ code: source }));
  const original = { name: 'mdx', config: () => undefined, transform };
  const plugin = cacheMdx(original);
  await plugin.transform('source', '/file.ts');
  await plugin.transform('source', '/file.ts');
  await plugin.transform('source', '/post.mdx');
  await cacheMdx(original).transform('source', '/post.mdx');
  expect(transform).toHaveBeenCalledTimes(4);
});

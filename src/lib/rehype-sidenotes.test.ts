import type { Element, ElementContent, Root } from 'hast';
import { describe, expect, it } from 'vitest';

import { rehypeSidenotes } from './rehype-sidenotes';

const text = (value: string): ElementContent => ({ type: 'text', value });
const el = (tagName: string, properties: Element['properties'], children: ElementContent[] = []): Element => ({
  type: 'element',
  tagName,
  properties,
  children
});

function post(noteChildren: ElementContent[]): Root {
  const paragraph = el('p', {}, [
    text('A claim.'),
    el('sup', {}, [el('a', { href: '#user-content-fn-1', dataFootnoteRef: true }, [text('1')])]),
    text(' More text.')
  ]);
  const notes = el('section', { dataFootnotes: true, className: ['footnotes'] }, [
    el('ol', {}, [el('li', { id: 'user-content-fn-1' }, noteChildren)])
  ]);
  return { type: 'root', children: [paragraph, notes] };
}

const backref = el('a', { href: '#user-content-fnref-1', dataFootnoteBackref: '' }, [text('↩')]);

describe('rehypeSidenotes', () => {
  it('places a copy of the note after its reference', () => {
    const tree = post([
      el('p', {}, [text('See '), el('a', { href: 'https://example.com' }, [text('this')]), text(' '), backref])
    ]);
    rehypeSidenotes()(tree);

    const paragraph = tree.children[0] as Element;
    const sidenote = paragraph.children[2] as Element;
    expect(sidenote.properties).toMatchObject({ className: ['sidenote'], ariaHidden: 'true' });
    expect(sidenote.children[0]).toMatchObject({ properties: { className: ['sidenote-number'] } });
    expect(sidenote.children.slice(2)).toMatchObject([
      text('See '),
      { tagName: 'a', properties: { href: 'https://example.com', tabIndex: -1 } }
    ]);
    expect((tree.children[1] as Element).properties.className).toEqual(['footnotes', 'has-sidenotes']);
  });

  it('leaves posts unchanged when a note contains block content', () => {
    const tree = post([el('ul', {}, [el('li', {}, [text('Item')])])]);
    rehypeSidenotes()(tree);

    expect((tree.children[0] as Element).children).toHaveLength(3);
    expect((tree.children[1] as Element).properties.className).toEqual(['footnotes']);
  });

  it('copies a note only beside its first reference', () => {
    const tree = post([el('p', {}, [text('Once.'), backref])]);
    const paragraph = tree.children[0] as Element;
    paragraph.children.push(
      el('sup', {}, [el('a', { href: '#user-content-fn-1', dataFootnoteRef: true }, [text('1')])])
    );
    rehypeSidenotes()(tree);

    const copies = paragraph.children.filter((node) => node.type === 'element' && node.properties.className);
    expect(copies).toHaveLength(1);
  });
});

import type { Element, ElementContent, Root } from 'hast';
import { visit } from 'unist-util-visit';

const isElement = (node: ElementContent): node is Element => node.type === 'element';
const isWhitespace = (node: ElementContent) => node.type === 'text' && !node.value.trim();

/** Collect a footnote's inline content, or `undefined` when it holds more than plain paragraphs. */
function inlineContent(item: Element): ElementContent[] | undefined {
  const parts: ElementContent[][] = [];
  for (const child of item.children) {
    if (isWhitespace(child)) continue;
    if (!isElement(child) || child.tagName !== 'p') return undefined;
    const content = child.children.filter(
      (node) => !(isElement(node) && node.properties.dataFootnoteBackref !== undefined)
    );
    while (content.length > 0 && isWhitespace(content[content.length - 1])) content.pop();
    parts.push(content);
  }
  return parts.flatMap((content, index) => (index === 0 ? content : [{ type: 'text', value: ' ' }, ...content]));
}

/** Keep links in the visual copy out of the tab order; the notes section remains the accessible version. */
function removeFromTabOrder(nodes: ElementContent[]) {
  for (const node of nodes) {
    if (!isElement(node)) continue;
    if (node.tagName === 'a') node.properties.tabIndex = -1;
    removeFromTabOrder(node.children);
  }
}

/**
 * Copy each GFM footnote next to its reference as a sidenote. CSS shows the copies in the
 * right margin on wide screens and keeps the regular notes section everywhere else.
 * Posts whose notes contain lists, code or other blocks keep only the notes section.
 */
export function rehypeSidenotes() {
  return function (tree: Root) {
    let section: Element | undefined;
    visit(tree, 'element', (node) => {
      if (node.tagName === 'section' && node.properties.dataFootnotes !== undefined) section = node;
    });
    if (!section) return;

    const items: Element[] = [];
    visit(section, 'element', (node) => {
      if (node.tagName === 'li' && typeof node.properties.id === 'string') items.push(node);
    });
    const notes = new Map<string, ElementContent[]>();
    for (const item of items) {
      const content = inlineContent(item);
      if (!content) return;
      notes.set(String(item.properties.id), content);
    }
    if (notes.size === 0) return;

    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'sup' || !parent || index === undefined) return;
      const ref = node.children.find(
        (child): child is Element => isElement(child) && child.properties.dataFootnoteRef !== undefined
      );
      if (!ref || typeof ref.properties.href !== 'string') return;
      const id = ref.properties.href.replace(/^#/, '');
      const content = notes.get(id);
      if (!content) return;
      // A note referenced again gets no second copy in the margin.
      notes.delete(id);

      const copy = structuredClone(content);
      removeFromTabOrder(copy);
      const number = ref.children.map((child) => (child.type === 'text' ? child.value : '')).join('');
      parent.children.splice(index + 1, 0, {
        type: 'element',
        tagName: 'span',
        properties: { className: ['sidenote'], ariaHidden: 'true' },
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['sidenote-number'] },
            children: [{ type: 'text', value: number }]
          },
          { type: 'text', value: ' ' },
          ...copy
        ]
      });
      return index + 2;
    });

    const className = Array.isArray(section.properties.className) ? section.properties.className : [];
    section.properties.className = [...className, 'has-sidenotes'];
  };
}

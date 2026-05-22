import type { Root } from 'mdast';
import { visit } from 'unist-util-visit';

/**
 * Remark plugin that injects word count into the MDX frontmatter data.
 * Modifies the YAML AST node so remark-mdx-frontmatter picks it up and exports it.
 * This runs at build time so reading time works in Docker (no runtime FS access needed).
 */
export function remarkWordCount() {
  return function (tree: Root) {
    let wordCount = 0;

    visit(tree, 'text', (node: { value: string }) => {
      const words = node.value.trim().split(/\s+/).filter(Boolean);
      wordCount += words.length;
    });

    // Inject wordCount into the YAML frontmatter node so remark-mdx-frontmatter exports it
    visit(tree, 'yaml', (node: { value: string }) => {
      node.value = node.value.trimEnd() + `\nwordCount: ${wordCount}`;
    });
  };
}

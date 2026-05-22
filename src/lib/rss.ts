/**
 * RSS Feed Generator
 * Simple RSS 2.0 feed generation without external dependencies
 */

type RSSOptions = {
  title: string;
  site_url: string;
  feed_url: string;
  description?: string;
  language?: string;
};

type RSSItem = {
  title: string;
  url: string;
  date: Date | string;
  description?: string;
  enclosure?: { url: string };
};

export class RSS {
  private options: RSSOptions;
  private items: RSSItem[] = [];

  constructor(options: RSSOptions) {
    this.options = options;
  }

  item(item: RSSItem) {
    this.items.push(item);
  }

  xml({ indent = false }: { indent?: boolean } = {}) {
    const indentStr = indent ? '  ' : '';
    const newline = indent ? '\n' : '';

    const itemsXml = this.items
      .map((item) => {
        const pubDate = new Date(item.date).toUTCString();
        const enclosureXml = item.enclosure
          ? `${newline}${indentStr}${indentStr}<enclosure url="${escapeXml(item.enclosure.url)}" />`
          : '';

        return `${indentStr}<item>${newline}${indentStr}${indentStr}<title>${escapeXml(item.title)}</title>${newline}${indentStr}${indentStr}<link>${escapeXml(item.url)}</link>${newline}${indentStr}${indentStr}<pubDate>${pubDate}</pubDate>${item.description ? `${newline}${indentStr}${indentStr}<description>${escapeXml(item.description)}</description>` : ''}${enclosureXml}${newline}${indentStr}</item>`;
      })
      .join(newline);

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
${indentStr}<channel>
${indentStr}${indentStr}<title>${escapeXml(this.options.title)}</title>
${indentStr}${indentStr}<link>${escapeXml(this.options.site_url)}</link>
${indentStr}${indentStr}<description>${escapeXml(this.options.description || this.options.title)}</description>
${indentStr}${indentStr}<language>${this.options.language || 'en'}</language>
${newline}${itemsXml}${newline}
${indentStr}</channel>
</rss>`;
  }
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

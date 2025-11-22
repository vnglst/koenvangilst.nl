import { describe, expect,it } from 'vitest';

import { RSS } from './rss';

describe('RSS', () => {
  it('should create a basic RSS feed', () => {
    const feed = new RSS({
      title: 'Test Feed',
      site_url: 'https://example.com',
      feed_url: 'https://example.com/feed.xml'
    });

    const xml = feed.xml();

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<rss version="2.0">');
    expect(xml).toContain('<title>Test Feed</title>');
    expect(xml).toContain('<link>https://example.com</link>');
    expect(xml).toContain('<language>en</language>');
  });

  it('should add items to the feed', () => {
    const feed = new RSS({
      title: 'Test Feed',
      site_url: 'https://example.com',
      feed_url: 'https://example.com/feed.xml'
    });

    feed.item({
      title: 'Test Item',
      url: 'https://example.com/item1',
      date: new Date('2025-01-01'),
      description: 'This is a test item'
    });

    const xml = feed.xml();

    expect(xml).toContain('<item>');
    expect(xml).toContain('<title>Test Item</title>');
    expect(xml).toContain('<link>https://example.com/item1</link>');
    expect(xml).toContain('<description>This is a test item</description>');
    expect(xml).toContain('<pubDate>');
  });

  it('should handle multiple items', () => {
    const feed = new RSS({
      title: 'Test Feed',
      site_url: 'https://example.com',
      feed_url: 'https://example.com/feed.xml'
    });

    feed.item({
      title: 'Item 1',
      url: 'https://example.com/item1',
      date: new Date('2025-01-01')
    });

    feed.item({
      title: 'Item 2',
      url: 'https://example.com/item2',
      date: new Date('2025-01-02')
    });

    const xml = feed.xml();

    expect(xml).toContain('Item 1');
    expect(xml).toContain('Item 2');
    expect(xml.match(/<item>/g)?.length).toBe(2);
  });

  it('should escape XML special characters', () => {
    const feed = new RSS({
      title: 'Test & Feed <with> "special" characters',
      site_url: 'https://example.com',
      feed_url: 'https://example.com/feed.xml'
    });

    const xml = feed.xml();

    expect(xml).toContain('Test &amp; Feed &lt;with&gt; &quot;special&quot; characters');
    expect(xml).not.toContain('Test & Feed <with> "special" characters');
  });

  it('should handle items with enclosures', () => {
    const feed = new RSS({
      title: 'Test Feed',
      site_url: 'https://example.com',
      feed_url: 'https://example.com/feed.xml'
    });

    feed.item({
      title: 'Photo Item',
      url: 'https://example.com/photo',
      date: new Date('2025-01-01'),
      enclosure: { url: 'https://example.com/photo.jpg' }
    });

    const xml = feed.xml();

    expect(xml).toContain('<enclosure url="https://example.com/photo.jpg" />');
  });

  it('should format with indentation when requested', () => {
    const feed = new RSS({
      title: 'Test Feed',
      site_url: 'https://example.com',
      feed_url: 'https://example.com/feed.xml'
    });

    feed.item({
      title: 'Test Item',
      url: 'https://example.com/item1',
      date: new Date('2025-01-01')
    });

    const xml = feed.xml({ indent: true });

    expect(xml).toContain('\n');
    expect(xml).toContain('  <channel>');
    expect(xml).toContain('    <title>');
  });

  it('should use custom description when provided', () => {
    const feed = new RSS({
      title: 'Test Feed',
      site_url: 'https://example.com',
      feed_url: 'https://example.com/feed.xml',
      description: 'Custom description'
    });

    const xml = feed.xml();

    expect(xml).toContain('<description>Custom description</description>');
  });

  it('should use title as description fallback', () => {
    const feed = new RSS({
      title: 'Test Feed',
      site_url: 'https://example.com',
      feed_url: 'https://example.com/feed.xml'
    });

    const xml = feed.xml();

    expect(xml).toContain('<description>Test Feed</description>');
  });

  it('should handle items without description', () => {
    const feed = new RSS({
      title: 'Test Feed',
      site_url: 'https://example.com',
      feed_url: 'https://example.com/feed.xml'
    });

    feed.item({
      title: 'Test Item',
      url: 'https://example.com/item1',
      date: new Date('2025-01-01')
    });

    const xml = feed.xml();

    expect(xml).toContain('<title>Test Item</title>');
    // Channel description should be present, but item description should not
    const itemMatch = xml.match(/<item>.*?<\/item>/s);
    expect(itemMatch).toBeTruthy();
    expect(itemMatch![0]).not.toContain('<description>');
  });
});

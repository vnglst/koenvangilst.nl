import { describe, it, expect } from 'vitest';
import { calculateReadingTime } from './reading-time';

describe('calculateReadingTime', () => {
  it('should calculate reading time for a short text', () => {
    const text = 'This is a short text with ten words here now.';
    const result = calculateReadingTime(text);

    expect(result.words).toBe(10);
    expect(result.minutes).toBe(1); // 10 words / 200 wpm = 0.05 min, rounded up to 1
    expect(result.text).toBe('1 min read');
  });

  it('should calculate reading time for a longer text', () => {
    const text = 'word '.repeat(600); // 600 words
    const result = calculateReadingTime(text);

    expect(result.words).toBe(600);
    expect(result.minutes).toBe(3); // 600 / 200 = 3
    expect(result.text).toBe('3 min read');
  });

  it('should round up reading time', () => {
    const text = 'word '.repeat(250); // 250 words
    const result = calculateReadingTime(text);

    expect(result.words).toBe(250);
    expect(result.minutes).toBe(2); // 250 / 200 = 1.25, rounded up to 2
    expect(result.text).toBe('2 min read');
  });

  it('should handle empty text', () => {
    const result = calculateReadingTime('');

    expect(result.words).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.text).toBe('0 min read');
  });

  it('should handle text with multiple spaces', () => {
    const text = 'word    word   word'; // 3 words with multiple spaces
    const result = calculateReadingTime(text);

    expect(result.words).toBe(3);
  });

  it('should handle custom words per minute', () => {
    const text = 'word '.repeat(300); // 300 words
    const result = calculateReadingTime(text, 150); // 150 wpm instead of default 200

    expect(result.words).toBe(300);
    expect(result.minutes).toBe(2); // 300 / 150 = 2
  });

  it('should calculate time in milliseconds', () => {
    const text = 'word '.repeat(200); // 200 words
    const result = calculateReadingTime(text);

    expect(result.time).toBe(60000); // 1 minute = 60000 ms
  });

  it('should trim whitespace before counting', () => {
    const text = '   word word word   ';
    const result = calculateReadingTime(text);

    expect(result.words).toBe(3);
  });
});

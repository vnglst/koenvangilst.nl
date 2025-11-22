import { describe, it, expect } from 'vitest';
import { cx } from './clsx';

describe('cx', () => {
  it('should join multiple class names', () => {
    const result = cx('foo', 'bar', 'baz');
    expect(result).toBe('foo bar baz');
  });

  it('should filter out falsy values', () => {
    const result = cx('foo', false, 'bar', null, 'baz', undefined);
    expect(result).toBe('foo bar baz');
  });

  it('should handle empty arguments', () => {
    const result = cx();
    expect(result).toBe('');
  });

  it('should handle all falsy values', () => {
    const result = cx(false, null, undefined);
    expect(result).toBe('');
  });

  it('should handle single class name', () => {
    const result = cx('foo');
    expect(result).toBe('foo');
  });

  it('should handle conditional class names with boolean flags', () => {
    const isActive = true;
    const isDisabled = false;

    const result = cx('btn', isActive && 'active', isDisabled && 'disabled');
    expect(result).toBe('btn active');
  });

  it('should handle mixed truthy and falsy values', () => {
    const result = cx('a', '', 'b', 0, 'c', false, 'd');
    expect(result).toBe('a b c d');
  });

  it('should handle class names with hyphens and underscores', () => {
    const result = cx('btn-primary', 'text_bold', 'my-class');
    expect(result).toBe('btn-primary text_bold my-class');
  });

  it('should handle Tailwind-style class names', () => {
    const result = cx(
      'flex',
      'items-center',
      'justify-center',
      false && 'hidden',
      'bg-gray-100',
      'dark:bg-gray-800'
    );
    expect(result).toBe('flex items-center justify-center bg-gray-100 dark:bg-gray-800');
  });

  it('should handle only non-string truthy values (should be filtered)', () => {
    const result = cx('foo', true, 'bar');
    expect(result).toBe('foo bar');
  });

  it('should handle className toggling pattern', () => {
    const isDark = true;
    const result = cx('container', isDark ? 'dark-theme' : 'light-theme');
    expect(result).toBe('container dark-theme');
  });

  it('should return empty string for single falsy value', () => {
    expect(cx(false)).toBe('');
    expect(cx(null)).toBe('');
    expect(cx(undefined)).toBe('');
  });
});

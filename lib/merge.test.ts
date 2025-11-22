import { describe, it, expect } from 'vitest';
import { merge } from './merge';

describe('merge', () => {
  it('should merge two simple objects', () => {
    const target = { a: 1, b: 2 };
    const source = { c: 3 };
    const result = merge(target, source);

    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('should override target properties with source properties', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };
    const result = merge(target, source);

    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('should deeply merge nested objects', () => {
    const target = {
      a: 1,
      nested: {
        x: 10,
        y: 20
      }
    };
    const source = {
      nested: {
        y: 30,
        z: 40
      }
    };
    const result = merge(target, source);

    expect(result).toEqual({
      a: 1,
      nested: {
        x: 10,
        y: 30,
        z: 40
      }
    });
  });

  it('should not mutate the original target object', () => {
    const target = { a: 1, b: 2 };
    const source = { c: 3 };
    const result = merge(target, source);

    expect(target).toEqual({ a: 1, b: 2 });
    expect(result).not.toBe(target);
  });

  it('should handle empty source object', () => {
    const target = { a: 1, b: 2 };
    const source = {};
    const result = merge(target, source);

    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('should handle empty target object', () => {
    const target = {};
    const source = { a: 1, b: 2 };
    const result = merge(target, source);

    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('should merge multiple levels of nesting', () => {
    const target = {
      level1: {
        level2: {
          level3: {
            value: 'old'
          }
        }
      }
    };
    const source = {
      level1: {
        level2: {
          level3: {
            value: 'new',
            newProp: 'added'
          }
        }
      }
    };
    const result = merge(target, source);

    expect(result.level1.level2.level3.value).toBe('new');
    expect(result.level1.level2.level3.newProp).toBe('added');
  });

  it('should handle non-object values correctly', () => {
    const target = { a: 1 };
    const source = { a: 'string', b: null, c: undefined };
    const result = merge(target, source);

    expect(result).toEqual({ a: 'string', b: null, c: undefined });
  });

  it('should not merge arrays (replace them)', () => {
    const target = { arr: [1, 2, 3] };
    const source = { arr: [4, 5] };
    const result = merge(target, source);

    expect(result.arr).toEqual([4, 5]);
  });

  it('should handle boolean values', () => {
    const target = { flag: true };
    const source = { flag: false };
    const result = merge(target, source);

    expect(result.flag).toBe(false);
  });

  it('should handle number values including zero', () => {
    const target = { num: 100 };
    const source = { num: 0 };
    const result = merge(target, source);

    expect(result.num).toBe(0);
  });

  it('should work with ECharts-style config objects', () => {
    const target = {
      toolbox: {
        feature: {
          saveAsImage: {
            title: 'Save',
            show: true
          }
        }
      }
    };
    const source = {
      toolbox: {
        right: 15,
        top: 15
      }
    };
    const result = merge(target, source);

    expect(result).toEqual({
      toolbox: {
        feature: {
          saveAsImage: {
            title: 'Save',
            show: true
          }
        },
        right: 15,
        top: 15
      }
    });
  });
});

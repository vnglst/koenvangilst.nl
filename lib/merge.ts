/**
 * Deep merge two objects (simple implementation for configuration objects)
 * @param target The target object
 * @param source The source object to merge
 * @returns The merged object
 */
export function merge<T extends Record<string, unknown>, U extends Record<string, unknown>>(
  target: T,
  source: U
): T & U {
  const output = { ...target } as Record<string, unknown>;

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = output[key];

      if (isObject(sourceValue) && isObject(targetValue)) {
        output[key] = merge(targetValue, sourceValue);
      } else {
        output[key] = sourceValue;
      }
    }
  }

  return output as T & U;
}

function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

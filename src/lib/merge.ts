/**
 * Deep merge two objects (simple implementation for configuration objects)
 * @param target The target object
 * @param source The source object to merge
 * @returns The merged object
 */
export function merge<T extends Record<string, unknown>, TSource extends Record<string, unknown>>(
  target: T,
  source: TSource
): T & TSource {
  const output = { ...target } as Record<string, unknown>;

  for (const [key, sourceValue] of Object.entries(source)) {
    const targetValue = output[key];
    output[key] = isObject(sourceValue) && isObject(targetValue) ? merge(targetValue, sourceValue) : sourceValue;
  }

  return output as T & TSource;
}

function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

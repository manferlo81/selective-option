export function createResult<K extends string, T>(keys: K[], value: T, input?: Record<K, T>): Record<K, T> {
  const result = input || {} as Record<K, T>;
  const { length: len } = keys;
  for (let i = 0; i < len; i++) {
    result[keys[i]] = value;
  }
  return result;
}

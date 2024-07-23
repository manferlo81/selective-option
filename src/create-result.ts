export function createResult<K extends string, V>(keys: K[], value: V): Record<K, V>;
export function createResult<K extends string, V>(keys: K[], value: V, input: Record<K, V>): Record<K, V>;
export function createResult<K extends string, V>(keys: K[], value: V, input?: Record<K, V>): Record<K, V> {
  const result = input || {} as Record<K, V>;
  const { length: len } = keys;
  for (let i = 0; i < len; i++) {
    result[keys[i]] = value;
  }
  return result;
}

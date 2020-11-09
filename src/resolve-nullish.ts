import { keysToObject } from './extend';
import type { SelectiveResolved } from './types';

export function resolveNullish<K extends string, V>(
  value: unknown,
  keys: K[],
  defaultValue: V,
): SelectiveResolved<K, V> | void {
  if (value == null) {
    return keysToObject(
      keys,
      defaultValue,
    );
  }
}

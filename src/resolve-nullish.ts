import { keysToObject } from './extend';
import type { SelectiveResolved } from './types';

export function resolveNullish<K extends string, D>(
  value: unknown,
  keys: K[],
  defaultValue: D,
): SelectiveResolved<K, D> | void {
  if (value == null) {
    return keysToObject(
      keys,
      defaultValue,
    );
  }
}

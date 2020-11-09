import { applyKey } from './apply-key';
import { keysToObject } from './extend';
import type { SelectiveResolved, TypeCheckFunction } from './types';

export function resolveString<K extends string, S extends string>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Record<S, K[]>,
  isSpecialKey: TypeCheckFunction<S>,
): SelectiveResolved<K, boolean> | void {
  return applyKey(
    value,
    true,
    keysToObject(
      keys,
      false,
    ),
    isKey,
    special,
    isSpecialKey,
  );
}

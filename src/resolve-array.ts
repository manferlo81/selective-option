import { applyKey } from './apply-key';
import { keysToObject } from './extend';
import { isArray } from './type-check';
import type { SelectiveResolved, TypeCheckFunction } from './types';

export function resolveArray<K extends string, S extends string>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Record<S, K[]>,
  isSpecialKey: TypeCheckFunction<S>,
): SelectiveResolved<K, boolean> | void {
  if (isArray(value)) {
    const result = keysToObject(keys, false);
    for (let i = 0; i < value.length; i++) {
      const key = value[i];
      if (
        !applyKey(
          key,
          true,
          result,
          isKey,
          special,
          isSpecialKey,
        )
      ) {
        throw new Error(`"${key}" is not a valid key`);
      }
    }
    return result;
  }
}

import { keysToObject } from './extend';
import type { SelectiveResolved, TypeCheckFunction } from './types';

export function resolveString<K extends string, S extends string>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Record<S, K[]>,
  isSpecialKey: TypeCheckFunction<S>,
): SelectiveResolved<K, boolean> | void {

  if (isKey(value)) {
    const result = keysToObject(
      keys,
      false,
    );
    result[value] = true;
    return result;
  }

  if (isSpecialKey(value)) {
    return keysToObject(
      special[value],
      true,
      keysToObject(
        keys,
        false,
      ),
    );
  }

}

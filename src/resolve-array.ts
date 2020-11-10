import { createResult } from './create-result';
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

    const result = createResult(keys, false);

    for (let i = 0; i < value.length; i++) {

      const key = value[i];

      if (isSpecialKey(key)) {
        createResult(
          special[key],
          true,
          result,
        );
      } else if (isKey(key)) {
        result[key] = true;
      } else {
        throw new Error(`"${key}" is not a valid key`);
      }
    }

    return result;

  }
}

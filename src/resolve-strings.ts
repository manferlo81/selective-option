import { createResult } from './create-result';
import { isArray } from './type-check';
import type { SelectiveResolved, TypeCheckFunction } from './types';

export function resolveString<K extends string, S extends string>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Record<S, K[]>,
  isSpecialKey: TypeCheckFunction<S>,
  input?: SelectiveResolved<K, boolean>,
): SelectiveResolved<K, boolean> | void {

  if (isSpecialKey(value)) {
    return resolveArray(
      special[value],
      keys,
      isKey,
      special,
      isSpecialKey,
      input || createResult(keys, false),
    );
  }

  if (isKey(value)) {
    const result = input || createResult(keys, false);
    result[value] = true;
    return result;
  }

}

export function resolveArray<K extends string, S extends string>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Record<S, K[]>,
  isSpecialKey: TypeCheckFunction<S>,
  input?: SelectiveResolved<K, boolean>,
): SelectiveResolved<K, boolean> | void {

  if (isArray(value)) {

    const result = input || createResult(keys, false);

    for (let i = 0; i < value.length; i++) {

      const key = value[i];

      if (
        !resolveString(
          key,
          keys,
          isKey,
          special,
          isSpecialKey,
          result,
        )
      ) {
        throw new Error(`"${key}" is not a valid key`);
      }

    }

    return result;

  }

}

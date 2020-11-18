import { createResult } from './create-result';
import { isArray } from './type-check';
import type { Nullable, SelectiveResolved, TypeCheckFunction } from './types';

export function resolveString<K extends string>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Nullable<Record<string, K[]>>,
  input?: SelectiveResolved<K, boolean>,
): SelectiveResolved<K, boolean> | void {

  if (typeof value === 'string') {

    const specialKeys: Nullable<K[]> = special && special[value];

    if (specialKeys) {
      return resolveArray(
        specialKeys,
        keys,
        isKey,
        special,
        input || createResult(keys, false),
      );
    }

    if (isKey(value)) {
      const result = input || createResult(keys, false);
      result[value] = true;
      return result;
    }

  }

}

export function resolveArray<K extends string>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Nullable<Record<string, K[]>>,
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
          result,
        )
      ) {
        throw new Error(`"${key}" is not a valid key`);
      }

    }

    return result;

  }

}

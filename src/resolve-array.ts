import { createResult } from './create-result';
import { errorInvalidKey } from './errors';
import { processString } from './process-string';
import { isArray } from './type-check';
import type { Nullable, PotentialResolver, TypeCheckFunction } from './types';

export function createArrayResolver<K extends string>(
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
): PotentialResolver<K, boolean> {
  return (value) => {
    if (isArray(value)) {

      const result = createResult(keys, false);

      for (let i = 0; i < value.length; i++) {
        const key = value[i];
        if (
          (typeof key !== 'string') ||
          !processString(
            key,
            keys,
            isKey,
            special,
            result,
          )
        ) {
          throw errorInvalidKey(key);
        }
      }

      return result;

    }
  };
}

/** @deprecated */
export function resolveArray<K extends string>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
): Record<K, boolean> | void {
  return createArrayResolver(
    keys,
    isKey,
    special,
  )(value);
}

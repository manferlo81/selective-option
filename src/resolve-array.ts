import { createResult } from './create-result';
import { errorInvalidKey } from './errors';
import { resolveKey } from './resolve-key';
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
        if (typeof key !== 'string') {
          throw errorInvalidKey(key);
        }
        const resolved = resolveKey(
          key,
          isKey,
          special,
        );
        if (!resolved) {
          throw errorInvalidKey(key);
        }
        createResult(
          resolved,
          true,
          result,
        );
      }

      return result;

    }
  };
}

import { createResult } from './create-result';
import { errorInvalidKey } from './errors';
import type { AllowNullish, TypeCheckFunction } from './helper-types';
import { createKeyResolver } from './resolvers/key';
import type { KeyResolver } from './resolvers/types';
import { isArray } from './type-check';
import type { PotentialResolver } from './types';

export function createArrayResolver_v2<K extends string>(
  keys: K[],
  resolveKey: KeyResolver<K>,
): PotentialResolver<K, boolean> {
  return (value) => {
    if (isArray(value)) {

      const result = createResult(keys, false);

      for (let i = 0; i < value.length; i++) {
        const key = value[i];
        if (typeof key !== 'string') {
          throw errorInvalidKey(key);
        }
        const resolved = resolveKey(key);
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

export function createArrayResolver<K extends string>(
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<Record<string, K[]>>,
): PotentialResolver<K, boolean> {
  const resolveKey = createKeyResolver(isKey, special);
  return createArrayResolver_v2(keys, resolveKey);
}

import { createResult } from './create-result';
import type { AllowNullish, TypeCheckFunction } from './helper-types';
import { createKeyResolver } from './resolvers/key';
import type { KeyResolver, SpecialKeys } from './resolvers/types';
import type { PotentialResolver } from './types';

export function createStringResolver_v2<K extends string>(
  keys: K[],
  resolveKey: KeyResolver<K>,
): PotentialResolver<K, boolean> {

  return (value) => {
    if (typeof value === 'string') {
      const resolved = resolveKey(value);
      if (resolved) {
        const [r] = resolved;
        return createResult(
          r,
          true,
          createResult(
            keys,
            false,
          ),
        );
      }
    }
  };
}

export function createStringResolver<K extends string>(
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<SpecialKeys<string, K>>,
): PotentialResolver<K, boolean> {
  const resolveKey = createKeyResolver(isKey, special);
  return createStringResolver_v2(keys, resolveKey);
}

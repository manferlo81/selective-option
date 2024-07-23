import { createResult } from './create-result';
import type { AllowNullish, TypeCheckFunction } from './helper-types';
import { createMultiKeyResolver } from './resolvers/key';
import type { KeyResolver, SpecialKeys } from './resolvers/types';
import type { PotentialResolver } from './types';

export function createStringResolver_v2<K extends string>(
  keys: K[],
  resolveKey: KeyResolver<K>,
): PotentialResolver<K, boolean> {

  return (input) => {

    // exit if value is not a string
    if (typeof input !== 'string') return;

    // try to resolve value as key or special key
    const resolved = resolveKey(input);

    // exit if it can't be resolved
    if (!resolved) return;

    // return result
    return createResult(
      resolved,
      true,
      createResult(
        keys,
        false,
      ),
    );

  };

}

export function createStringResolver<K extends string>(
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<SpecialKeys<string, K>>,
): PotentialResolver<K, boolean> {
  const resolveKey = createMultiKeyResolver(isKey, special);
  return createStringResolver_v2(keys, resolveKey);
}

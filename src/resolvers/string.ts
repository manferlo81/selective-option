import { createResult } from '../create-result';
import type { AllowNullish, TypeCheckFunction } from '../helper-types';
import type { PotentialResolver } from '../types';
import { createKeyResolver, createMultiKeyResolver, createSpecialKeyResolver } from './key';
import type { KeyResolver, SpecialKeys } from './types';

export function createStringResolver_v2<K extends string>(keys: readonly K[], resolveMultiKey: KeyResolver<K>): PotentialResolver<K, boolean> {

  return (input) => {

    // exit if value is not a string
    if (typeof input !== 'string') return;

    // try to resolve value as key or special key
    const resolved = resolveMultiKey(input);

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
  keys: readonly K[],
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<SpecialKeys<string, K>>,
): PotentialResolver<K, boolean> {
  const resolveKey = createKeyResolver(isKey);
  const resolveSpecialKey = createSpecialKeyResolver(isKey, special);
  const resolveMultiKey = createMultiKeyResolver(resolveKey, resolveSpecialKey);
  return createStringResolver_v2(keys, resolveMultiKey);
}

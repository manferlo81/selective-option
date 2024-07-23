import type { AllowNullish, TypeCheckFunction } from '../helper-types';
import type { PotentialResolver } from '../types';
import { createObjectResolver_v2 } from './v2/object';
import { createKeyResolver, createSpecialKeyResolver } from './key';

export function createObjectResolver<K extends string, V, D = V>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<Record<string, K[]>>,
  defaultKey?: string,
): PotentialResolver<K, V | D> {

  // create key resolvers
  const resolveKey = createKeyResolver(isKey);
  const resolveSpecialKey = createSpecialKeyResolver(isKey, special);

  // return object resolver
  return createObjectResolver_v2(
    keys,
    isValidValue,
    defaultValue,
    resolveKey,
    resolveSpecialKey,
    defaultKey,
  );

}

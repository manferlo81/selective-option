import type { AllowNullish, TypeCheckFunction } from '../helper-types';
import type { PotentialResolver } from '../types';
import { createStringResolver_v2 } from './v2/string';
import { createKeyResolver, createMultiKeyResolver, createSpecialKeyResolver } from './key';
import type { SpecialKeys } from './types';

export function createStringResolver<K extends string>(
  keys: readonly K[],
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<SpecialKeys<string, K>>,
): PotentialResolver<K, boolean> {

  // create key resolvers
  const resolveKey = createKeyResolver(isKey);
  const resolveSpecialKey = createSpecialKeyResolver(isKey, special);
  const resolveMultiKey = createMultiKeyResolver(resolveKey, resolveSpecialKey);

  // return string resolver
  return createStringResolver_v2(
    keys,
    resolveMultiKey,
  );

}

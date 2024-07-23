import type { AllowNullish, TypeCheckFunction } from '../helper-types';
import type { PotentialResolver } from '../types';
import { createArrayResolver_v2 } from './v2/array';
import { createKeyResolver, createMultiKeyResolver, createSpecialKeyResolver } from './key';

export function createArrayResolver<K extends string>(
  keys: readonly K[],
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<Record<string, K[]>>,
): PotentialResolver<K, boolean> {
  const resolveKey = createKeyResolver(isKey);
  const resolveSpecialKey = createSpecialKeyResolver(isKey, special);
  const resolveMultiKey = createMultiKeyResolver(resolveKey, resolveSpecialKey);
  return createArrayResolver_v2(keys, resolveMultiKey);
}

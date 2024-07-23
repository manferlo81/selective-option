import type { AllowNullish, TypeCheckFunction } from '../helper-types';
import type { Resolver } from '../types';
import { createKeyResolver, createSpecialKeyResolver } from './key';
import { createValueBasedResolver_v2 } from './v2/value-based';

export function createValueBasedResolver<K extends string, V, D = V>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<Record<string, K[]>>,
  overrideKey?: string,
): Resolver<K, V | D> {

  // create key resolvers
  const resolveKey = createKeyResolver(isKey);
  const resolveSpecialKey = createSpecialKeyResolver(isKey, special);

  // return compiled resolver
  return createValueBasedResolver_v2(
    keys,
    isValidValue,
    defaultValue,
    resolveKey,
    resolveSpecialKey,
    overrideKey,
  );

}

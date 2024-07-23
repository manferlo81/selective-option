import { createResolver } from '../create-resolver';
import type { AllowNullish, TypeCheckFunction } from '../helper-types';
import type { Resolver } from '../types';
import { createKeyResolver, createSpecialKeyResolver } from './key';
import { createNullishResolver } from './nullish';
import { createObjectResolver_v2 } from './v2/object';
import { createValueResolver } from './value';

export function createValueBasedResolver<K extends string, V, D = V, DK extends string = 'default'>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<Record<string, K[]>>,
  defaultKey?: DK,
): Resolver<K, V | D> {

  // create key resolvers
  const resolveKey = createKeyResolver(isKey);
  const resolveSpecialKey = createSpecialKeyResolver(isKey, special);

  // create potential resolvers
  const resolveValue = createValueResolver(keys, isValidValue);
  const resolveNullish = createNullishResolver(keys, defaultValue);
  const resolveObject = createObjectResolver_v2(keys, isValidValue, defaultValue, resolveKey, resolveSpecialKey, defaultKey);

  // return compiled resolver
  return createResolver(
    resolveValue,
    resolveNullish,
    resolveObject,
  );

}

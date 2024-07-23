import { createResolver } from '../create-resolver';
import type { AllowNullish, TypeCheckFunction } from '../helper-types';
import type { Resolver } from '../types';
import { createArrayResolver_v2 } from './v2/array';
import { createKeyResolver, createMultiKeyResolver, createSpecialKeyResolver } from './key';
import { createNullishResolver } from './nullish';
import { createObjectResolver_v2 } from './v2/object';
import { createStringResolver_v2 } from './v2/string';
import { createValueResolver } from './value';

export function createBoolBasedResolver<K extends string, V, D = V>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<Record<string, K[]>>,
  overrideKey?: string,
): Resolver<K, V | D | boolean> {

  // create key resolvers
  const resolveKey = createKeyResolver(isKey);
  const resolveSpecialKey = createSpecialKeyResolver(isKey, special);
  const resolveMultiKey = createMultiKeyResolver(resolveKey, resolveSpecialKey);

  // create potential resolvers
  const resolveValue = createValueResolver(keys, isValidValue);
  const resolveNullish = createNullishResolver(keys, defaultValue);
  const resolveString = createStringResolver_v2(keys, resolveMultiKey);
  const resolveArray = createArrayResolver_v2(keys, resolveMultiKey);
  const resolveObject = createObjectResolver_v2(keys, isValidValue, defaultValue, resolveKey, resolveSpecialKey, overrideKey);

  // return compiled resolver
  return createResolver<K, V | D | boolean>(
    resolveValue,
    resolveNullish,
    resolveString,
    resolveArray,
    resolveObject,
  );
}

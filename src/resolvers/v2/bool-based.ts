import { createResolver } from '../../create-resolver';
import type { TypeCheckFunction } from '../../helper-types';
import type { Resolver } from '../../types';
import { createMultiKeyResolver } from '../key';
import { createNullishResolver } from '../nullish';
import type { KeyResolver } from '../types';
import { createValueResolver } from '../value';
import { createArrayResolver_v2 } from './array';
import { createObjectResolver_v2 } from './object';
import { createStringResolver_v2 } from './string';

export function createBoolBasedResolver_v2<K extends string, V, D = V>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  resolveKey: KeyResolver<K>,
  resolveSpecialKey: KeyResolver<K>,
  overrideKey?: string,
): Resolver<K, V | D | boolean> {

  // create key resolvers
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

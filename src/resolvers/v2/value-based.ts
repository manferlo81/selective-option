import { createResolver } from '../../create-resolver';
import type { TypeCheckFunction } from '../../helper-types';
import type { Resolver } from '../../types';
import { createNullishResolver } from '../nullish';
import type { KeyResolver } from '../types';
import { createValueResolver } from '../value';
import { createObjectResolver_v2 } from './object';

export function createValueBasedResolver_v2<K extends string, V, D = V>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  resolveKey: KeyResolver<K>,
  resolveSpecialKey: KeyResolver<K>,
  overrideKey?: string,
): Resolver<K, V | D> {

  // create potential resolvers
  const resolveValue = createValueResolver(keys, isValidValue);
  const resolveNullish = createNullishResolver(keys, defaultValue);
  const resolveObject = createObjectResolver_v2(keys, isValidValue, defaultValue, resolveKey, resolveSpecialKey, overrideKey);

  // return compiled resolver
  return createResolver(
    resolveValue,
    resolveNullish,
    resolveObject,
  );

}

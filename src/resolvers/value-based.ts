import { createResolver } from '../create-resolver';
import type { TypeCheckFunction } from '../helper-types';
import { createNullishResolver } from './nullish';
import type { KeyResolver, ValueBasedResolver } from './types';
import { createValueResolver } from './value';
import { createObjectResolver } from './object';

export function createValueBasedResolver<K extends string, S extends string, V, O extends string>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  resolveKey: KeyResolver<K>,
  resolveSpecialKey: KeyResolver<K>,
  overrideKey?: O,
): ValueBasedResolver<K, S, V, O> {

  // create potential resolvers
  const resolveValue = createValueResolver(keys, isValidValue);
  const resolveNullish = createNullishResolver(keys, defaultValue);
  const resolveObject = createObjectResolver(keys, isValidValue, defaultValue, resolveKey, resolveSpecialKey, overrideKey);

  // return compiled resolver
  return createResolver(
    resolveValue,
    resolveNullish,
    resolveObject,
  );

}

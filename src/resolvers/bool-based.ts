import { createResolver } from '../create-resolver';
import type { TypeCheckFunction } from '../helper-types';
import { createArrayResolver } from './array';
import { createMultiKeyResolver } from './key';
import { createNullishResolver } from './nullish';
import { createObjectResolver } from './object';
import { createStringResolver } from './string';
import type { BoolBasedResolver, KeyResolver } from './types';
import { createValueResolver } from './value';

export function createBoolBasedResolver<K extends string, S extends string, V, O extends string>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  resolveKey: KeyResolver<K>,
  resolveSpecialKey: KeyResolver<K>,
  overrideKey?: O,
): BoolBasedResolver<K, S, V | boolean, O> {

  // create key resolvers
  const resolveMultiKey = createMultiKeyResolver(resolveKey, resolveSpecialKey);

  // create boolean value validator
  const isValueOrBool = (value: unknown): value is V | boolean => {
    return isValidValue(value) || value === true || value === false;
  };

  // create potential resolvers
  const resolveValue = createValueResolver(keys, isValueOrBool);
  const resolveNullish = createNullishResolver(keys, defaultValue);
  const resolveString = createStringResolver(keys, resolveMultiKey);
  const resolveArray = createArrayResolver(keys, resolveMultiKey);
  const resolveObject = createObjectResolver(keys, isValueOrBool, defaultValue, resolveKey, resolveSpecialKey, overrideKey);

  // return compiled resolver
  return createResolver<K, V | boolean>(
    resolveValue,
    resolveNullish,
    resolveString,
    resolveArray,
    resolveObject,
  );

}

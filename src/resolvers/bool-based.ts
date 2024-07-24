import { createResolver } from '../create-resolver';
import type { TypeCheckFunction } from '../helper-types';
import { createArrayResolver } from './array';
import { createMultiKeyResolver } from './key';
import { createNullishResolver } from './nullish';
import { createObjectResolver } from './object';
import { createStringResolver } from './string';
import type { KeyResolver, Resolver } from './types';
import { createValueResolver } from './value';

export function createBoolBasedResolver<K extends string, V>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  resolveKey: KeyResolver<K>,
  resolveSpecialKey: KeyResolver<K>,
  overrideKey?: string,
): Resolver<K, V | boolean> {

  // create key resolvers
  const resolveMultiKey = createMultiKeyResolver(resolveKey, resolveSpecialKey);

  // create boolean value validator
  const isBooleanOrValue = (value: unknown): value is V | boolean => {
    return isValidValue(value) || value === true || value === false;
  };

  // create potential resolvers
  const resolveValue = createValueResolver(keys, isBooleanOrValue);
  const resolveNullish = createNullishResolver(keys, defaultValue);
  const resolveString = createStringResolver(keys, resolveMultiKey);
  const resolveArray = createArrayResolver(keys, resolveMultiKey);
  const resolveObject = createObjectResolver(keys, isBooleanOrValue, defaultValue, resolveKey, resolveSpecialKey, overrideKey);

  // return compiled resolver
  return createResolver<K, V | boolean>(
    resolveValue,
    resolveNullish,
    resolveString,
    resolveArray,
    resolveObject,
  );

}

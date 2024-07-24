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

export function createBoolBasedResolver_v2<K extends string, V>(
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
  const resolveString = createStringResolver_v2(keys, resolveMultiKey);
  const resolveArray = createArrayResolver_v2(keys, resolveMultiKey);
  const resolveObject = createObjectResolver_v2(keys, isBooleanOrValue, defaultValue, resolveKey, resolveSpecialKey, overrideKey);

  // return compiled resolver
  return createResolver<K, V | boolean>(
    resolveValue,
    resolveNullish,
    resolveString,
    resolveArray,
    resolveObject,
  );

}

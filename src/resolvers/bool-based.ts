import type { AllowNullish, TypeCheckFunction } from '../helper-types';
import { createArrayResolver } from './array';
import { createNullishResolver } from './nullish';
import { createObjectResolver } from './object';
import { createStringResolver } from './string';
import { createValueResolver } from './value';
import type { Resolver } from '../types';
import { createResolver } from '../create-resolver';

export function createBoolBasedResolver<K extends string, V, D = V>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<Record<string, K[]>>,
  overrideKey?: string,
): Resolver<K, V | D | boolean> {
  const resolveValue = createValueResolver(keys, isValidValue);
  const resolveNullish = createNullishResolver(keys, defaultValue);
  const resolveString = createStringResolver(keys, isKey, special);
  const resolveArray = createArrayResolver(keys, isKey, special);
  const resolveObject = createObjectResolver(keys, isValidValue, defaultValue, isKey, special, overrideKey);
  return createResolver<K, V | D | boolean>(
    resolveValue,
    resolveNullish,
    resolveString,
    resolveArray,
    resolveObject,
  );
}

import type { AllowNullish, TypeCheckFunction } from '../helper-types';
import { createNullishResolver } from './nullish';
import { createObjectResolver } from './object';
import { createValueResolver } from './value';
import type { Resolver } from '../types';
import { createResolver } from '../create-resolver';

export function createValueBasedResolver<K extends string, V, D = V, DK extends string = 'default'>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<Record<string, K[]>>,
  defaultKey?: DK,
): Resolver<K, V | D> {
  const resolveValue = createValueResolver(keys, isValidValue);
  const resolveNullish = createNullishResolver(keys, defaultValue);
  const resolveObject = createObjectResolver(keys, isValidValue, defaultValue, isKey, special, defaultKey);
  return createResolver(
    resolveValue,
    resolveNullish,
    resolveObject,
  );
}

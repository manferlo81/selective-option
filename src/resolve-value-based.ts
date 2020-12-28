import { resolveFailed } from './resolve-failed';
import { createNullishResolver } from './resolve-nullish';
import { createObjectResolver } from './resolve-object';
import { createValueResolver } from './resolve-value';
import type { Nullable, Resolver, TypeCheckFunction } from './types';

export function createValueBasedResolver<K extends string, V, D = V, DK extends string = 'default'>(
  keys: K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
  defaultKey?: DK,
): Resolver<K, V | D> {
  const resolveValue = createValueResolver(keys, isValidValue);
  const resolveNullish = createNullishResolver(keys, defaultValue);
  const resolveObject = createObjectResolver(keys, isValidValue, defaultValue, isKey, special, defaultKey);
  return (value) => (
    resolveValue(value) ||
    resolveNullish(value) ||
    resolveObject(value) ||
    resolveFailed(value)
  );
}

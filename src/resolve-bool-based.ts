import { createArrayResolver } from './resolve-array';
import { resolveFailed } from './resolve-failed';
import { createNullishResolver } from './resolve-nullish';
import { createObjectResolver } from './resolve-object';
import { createStringResolver } from './resolve-string';
import { createValueResolver } from './resolve-value';
import type { Nullable, Resolver, TypeCheckFunction } from './types';

export function createBoolBasedResolver<K extends string, V, D = V, DK extends string = 'default'>(
  keys: K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
  defaultKey?: DK,
): Resolver<K, V | D | boolean> {
  const resolveValue = createValueResolver(keys, isValidValue);
  const resolveNullish = createNullishResolver(keys, defaultValue);
  const resolveString = createStringResolver(keys, isKey, special);
  const resolveArray = createArrayResolver(keys, isKey, special);
  const resolveObject = createObjectResolver(keys, isValidValue, defaultValue, isKey, special, defaultKey);
  return (value) => (
    resolveValue(value) ||
    resolveNullish(value) ||
    resolveString(value) ||
    resolveArray(value) ||
    resolveObject(value) ||
    resolveFailed(value)
  );
}

/** @deprecated */
export function resolveBoolBased<K extends string, V, D = V>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Record<string, K[]>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
): Record<K, V | D | boolean> {
  return createBoolBasedResolver(
    keys,
    isValidValue,
    defaultValue,
    isKey,
    special,
  )(value);
}

import { resolveNullish } from './resolve-nullish';
import { resolveObject } from './resolve-object';
import { resolveValue } from './resolve-value';
import type { SelectiveResolved, TypeCheckFunction } from './types';

export function resolveValueBased<K extends string, S extends string, V>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Record<S, K[]>,
  isSpecialKey: TypeCheckFunction<S>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
): SelectiveResolved<K, V> {
  return (
    resolveValue(value, keys, isValidValue) ||
    resolveNullish(value, keys, defaultValue) ||
    resolveObject(value, keys, isKey, special, isSpecialKey, isValidValue, defaultValue)
  );
}

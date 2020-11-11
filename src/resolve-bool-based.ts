import { resolveNullish } from './resolve-nullish';
import { resolveObject } from './resolve-object';
import { resolveArray, resolveString } from './resolve-strings';
import { resolveValue } from './resolve-value';
import type { SelectiveResolved, TypeCheckFunction } from './types';

export function resolveBoolBased<K extends string, S extends string, V, D = V>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Record<S, K[]>,
  isSpecialKey: TypeCheckFunction<S>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
): SelectiveResolved<K, V | D | boolean> {
  return (
    resolveValue(value, keys, isValidValue) ||
    resolveNullish(value, keys, defaultValue) ||
    resolveString(value, keys, isKey, special, isSpecialKey) ||
    resolveArray(value, keys, isKey, special, isSpecialKey) ||
    resolveObject(value, keys, isKey, special, isSpecialKey, isValidValue, defaultValue)
  );
}

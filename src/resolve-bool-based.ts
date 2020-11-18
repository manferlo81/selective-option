import { resolveFailed } from './resolve-failed';
import { resolveNullish } from './resolve-nullish';
import { resolveObject } from './resolve-object';
import { resolveArray, resolveString } from './resolve-strings';
import { resolveValue } from './resolve-value';
import type { SelectiveResolved, TypeCheckFunction } from './types';

export function resolveBoolBased<K extends string, V, D = V>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Record<string, K[]>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
): SelectiveResolved<K, V | D | boolean> {
  return (
    resolveValue(value, keys, isValidValue) ||
    resolveNullish(value, keys, defaultValue) ||
    resolveString(value, keys, isKey, special) ||
    resolveArray(value, keys, isKey, special) ||
    resolveObject(value, keys, isKey, special, isValidValue, defaultValue) ||
    resolveFailed(value)
  );
}

import { resolveFailed } from './resolve-failed';
import { resolveNullish } from './resolve-nullish';
import { resolveObject } from './resolve-object';
import { resolveValue } from './resolve-value';
import type { SelectiveResolved, TypeCheckFunction } from './types';

export function resolveValueBased<K extends string, SK extends string, V, D = V>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Record<SK, K[]>,
  isSpecialKey: TypeCheckFunction<SK>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
): SelectiveResolved<K, V | D> {
  return (
    resolveValue(value, keys, isValidValue) ||
    resolveNullish(value, keys, defaultValue) ||
    resolveObject(value, keys, isKey, special, isSpecialKey, isValidValue, defaultValue) ||
    resolveFailed(value)
  );
}

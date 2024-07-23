import type { TypeCheckFunction } from '../helper-types';
import { createValueBasedResolver } from '../resolve-value-based';

/** @deprecated */
export function resolveValueBased<K extends string, V, D = V>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Record<string, K[]>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
): Record<K, V | D> {
  return createValueBasedResolver(
    keys,
    isValidValue,
    defaultValue,
    isKey,
    special,
  )(value);
}

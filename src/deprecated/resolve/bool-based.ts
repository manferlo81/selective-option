import type { TypeCheckFunction } from '../../helper-types';
import { createBoolBasedResolver } from '../../resolvers/bool-based';

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
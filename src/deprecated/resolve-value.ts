import { createValueResolver } from '../resolve-value';
import type { TypeCheckFunction } from '../types';

/** @deprecated */
export function resolveValue<K extends string, V>(
  value: unknown,
  keys: K[],
  isValidValue: TypeCheckFunction<V>,
): Record<K, V> | void {
  return createValueResolver(
    keys,
    isValidValue,
  )(value);
}

import type { TypeCheckFunction } from '../../helper-types';
import { createValueResolver } from '../../resolvers/value';

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

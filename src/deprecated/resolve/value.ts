import type { TypeCheckFunction } from '../../helper-types';
import { createValueResolver } from '../../resolvers/value';
import type { Resolved } from '../../types';

/** @deprecated */
export function resolveValue<K extends string, V>(
  value: unknown,
  keys: K[],
  isValidValue: TypeCheckFunction<V>,
): Resolved<K, V> | void {
  return createValueResolver(
    keys,
    isValidValue,
  )(value);
}

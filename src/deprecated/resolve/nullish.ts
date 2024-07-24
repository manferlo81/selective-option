import { createNullishResolver } from '../../resolvers/nullish';
import type { Resolved } from '../../types';

/** @deprecated */
export function resolveNullish<K extends string, V>(
  value: unknown,
  keys: K[],
  defaultValue: V,
): Resolved<K, V> | void {
  return createNullishResolver(
    keys,
    defaultValue,
  )(value);
}

import type { TypeCheckFunction } from '../../helper-types';
import { createValueBasedResolver } from '../../resolvers/value-based';
import type { Resolved } from '../../types';

/** @deprecated */
export function resolveValueBased<K extends string, V>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Record<string, K[]>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
): Resolved<K, V> {
  return createValueBasedResolver(
    keys,
    isValidValue,
    defaultValue,
    isKey,
    special,
  )(value);
}

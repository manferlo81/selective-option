import type { AllowNullish, TypeCheckFunction } from '../../helper-types';
import { createObjectResolver } from '../../resolvers/object';
import type { Resolved } from '../../types';

/** @deprecated */
export function resolveObject<K extends string, V>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: AllowNullish<Record<string, K[]>>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
): Resolved<K, V> | void {
  return createObjectResolver(
    keys,
    isValidValue,
    defaultValue,
    isKey,
    special,
  )(value);
}

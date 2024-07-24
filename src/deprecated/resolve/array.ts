import type { AllowNullish, TypeCheckFunction } from '../../helper-types';
import { createArrayResolver } from '../../resolvers/array';
import type { Resolved } from '../../types';

/** @deprecated */
export function resolveArray<K extends string>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<Record<string, K[]>>,
): Resolved<K, boolean> | void {
  return createArrayResolver(
    keys,
    isKey,
    special,
  )(value);
}

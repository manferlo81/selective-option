import { createArrayResolver } from '../resolve-array';
import type { Nullable, TypeCheckFunction } from '../types';

/** @deprecated */
export function resolveArray<K extends string>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
): Record<K, boolean> | void {
  return createArrayResolver(
    keys,
    isKey,
    special,
  )(value);
}

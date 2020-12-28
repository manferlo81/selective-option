import { createStringResolver } from '../resolve-string';
import type { Nullable, TypeCheckFunction } from '../types';

/** @deprecated */
export function resolveString<K extends string>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
): Record<K, boolean> | void {
  return createStringResolver(
    keys,
    isKey,
    special,
  )(value);
}

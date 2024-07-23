import type { AllowNullish, TypeCheckFunction } from '../helper-types';
import { createArrayResolver } from '../resolve-array';

/** @deprecated */
export function resolveArray<K extends string>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<Record<string, K[]>>,
): Record<K, boolean> | void {
  return createArrayResolver(
    keys,
    isKey,
    special,
  )(value);
}

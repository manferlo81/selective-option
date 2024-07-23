import type { AllowNullish, TypeCheckFunction } from '../helper-types';
import { createStringResolver } from '../resolve-string';

/** @deprecated */
export function resolveString<K extends string>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<Record<string, K[]>>,
): Record<K, boolean> | void {
  return createStringResolver(
    keys,
    isKey,
    special,
  )(value);
}

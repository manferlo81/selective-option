import type { AllowNullish, TypeCheckFunction } from '../../helper-types';
import { createStringResolver } from '../../resolvers/string';
import type { Resolved } from '../../types';

/** @deprecated */
export function resolveString<K extends string>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<Record<string, K[]>>,
): Resolved<K, boolean> | void {
  return createStringResolver(
    keys,
    isKey,
    special,
  )(value);
}

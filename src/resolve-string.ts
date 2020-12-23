import { processString } from './process-string';
import type { Nullable, PotentialResolver, TypeCheckFunction } from './types';

export function createStringResolver<K extends string>(
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
): PotentialResolver<K, boolean> {
  return (value) => {
    if (typeof value === 'string') {
      return processString(
        value,
        keys,
        isKey,
        special,
      );
    }
  };
}

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

import { createResult } from './create-result';
import type { PotentialResolver } from './types';

export function createNullishResolver<K extends string, D>(
  keys: K[],
  defaultValue: D,
): PotentialResolver<K, D> {
  return (value) => {
    if (value == null) {
      return createResult(
        keys,
        defaultValue,
      );
    }
  };
}

/** @deprecated */
export function resolveNullish<K extends string, D>(
  value: unknown,
  keys: K[],
  defaultValue: D,
): Record<K, D> | void {
  return createNullishResolver(
    keys,
    defaultValue,
  )(value);
}

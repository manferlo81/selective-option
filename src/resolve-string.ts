import { createResult } from './create-result';
import { resolveKey } from './resolve-key';
import type { Nullable, PotentialResolver, TypeCheckFunction } from './types';

export function createStringResolver<K extends string>(
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
): PotentialResolver<K, boolean> {
  return (value) => {
    if (typeof value === 'string') {
      const resolved = resolveKey(
        value,
        isKey,
        special,
      );
      if (resolved) {
        return createResult(
          resolved,
          true,
          createResult(
            keys,
            false,
          ),
        );
      }
    }
  };
}

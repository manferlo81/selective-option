import { createResult } from './create-result';
import type { PotentialResolver } from './types';

export function createBoolResolver<K extends string>(
  keys: K[],
): PotentialResolver<K, boolean> {
  return (value) => {
    if (value === true || value === false) {
      return createResult(
        keys,
        value,
      );
    }
  };
}

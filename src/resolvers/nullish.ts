import { createResult } from '../create-result';
import type { PotentialResolver } from '../types';

export function createNullishResolver<K extends string, D>(
  keys: readonly K[],
  defaultValue: D,
): PotentialResolver<K, D> {

  // return resolver
  return (value) => {

    // exit if value is not nullish
    if (value != null) return;

    // return default result
    return createResult(
      keys,
      defaultValue,
    );

  };

}

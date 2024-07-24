import { createResult } from '../create-result';
import type { PotentialResolver } from '../types';

export function createNullishResolver<K extends string, V>(
  keys: readonly K[],
  value: V,
): PotentialResolver<K, V> {

  // return resolver
  return (input) => {

    // exit if value is not nullish
    if (input != null) return;

    // return default result
    return createResult(
      keys,
      value,
    );

  };

}

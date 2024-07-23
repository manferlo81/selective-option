import { createResult } from '../create-result';
import type { TypeCheckFunction } from '../helper-types';
import type { PotentialResolver } from '../types';

export function createValueResolver<K extends string, V>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
): PotentialResolver<K, V> {

  return (value) => {

    // exit if it's not a valid value
    if (!isValidValue(value)) return;

    // return result
    return createResult(
      keys,
      value,
    );

  };

}

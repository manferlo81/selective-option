import { createResult } from '../create-result';
import type { TypeCheckFunction } from '../private-types';
import type { KeyList, PotentialResolver } from './types';

export function createValueResolver<K extends string, V>(
  keys: KeyList<K>,
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

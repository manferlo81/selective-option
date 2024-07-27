import { createResult } from '../create-result';
import type { TypeCheckFunction } from '../private-types';
import type { KeyList, PotentialResolver } from './types';

export function createValueResolver<K extends string, V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
): PotentialResolver<K, V> {

  return (value) => {

    if (isValidValue(value)) return createResult(
      keys,
      value,
    );

    if (value == null) return createResult(
      keys,
      defaultValue,
    );

  };

}

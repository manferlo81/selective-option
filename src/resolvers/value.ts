import { createResult } from '../create-result';
import type { KeyList, TypeCheckFunction } from '../private-types';
import { resolveValueOrNullish } from '../tools/value-nullish';
import type { PotentialResolver } from './types';

export function createValueResolver<K extends string, V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
): PotentialResolver<K, V> {

  return (value) => {

    const valueResolved = resolveValueOrNullish(value, isValidValue);

    if (!valueResolved) return;

    const [isValid, validatedValue] = valueResolved;

    if (isValid) return createResult(
      keys,
      validatedValue,
    );

    return createResult(
      keys,
      defaultValue,
    );

  };

}

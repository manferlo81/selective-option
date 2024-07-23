import { createResult } from '../../create-result';
import { errorInvalidKey } from '../../errors';
import { is, isArray } from '../../is';
import type { PotentialResolver, Resolved } from '../../types';
import type { KeyResolver } from '../types';

export function createArrayResolver_v2<K extends string>(
  keys: readonly K[],
  resolveKey: KeyResolver<K>,
): PotentialResolver<K, boolean> {

  // return array resolver
  return (input) => {

    // exit if value is not an array
    if (!isArray(input)) return;

    const defaultResult = createResult(
      keys,
      false,
    );

    return input.reduce<Resolved<K, boolean>>((output, key) => {

      // throw if item is not a string
      if (!is(key, 'string')) throw errorInvalidKey(key);

      // try to resolve as key or special key
      const resolved = resolveKey(key);

      // throw if it can't be resolved
      if (!resolved) throw errorInvalidKey(key);

      // return updated result
      return createResult(
        resolved,
        true,
        output,
      );

    }, defaultResult);

  };

}

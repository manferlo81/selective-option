import { createResult } from '../../create-result';
import { errorInvalidKey } from '../../errors';
import { is, isArray } from '../../is';
import type { PotentialResolver } from '../../types';
import type { KeyResolver } from '../types';

export function createArrayResolver_v2<K extends string>(
  keys: readonly K[],
  resolveMultiKey: KeyResolver<K>,
): PotentialResolver<K, boolean> {

  // return array resolver
  return (input) => {

    // exit if value is not an array
    if (!isArray(input)) return;

    // create default result
    const result = createResult(keys, false);

    // iterate through array
    for (const key of input) {

      // throw if item is not a string
      if (!is(key, 'string')) throw errorInvalidKey(key);

      // try to resolve as key or special key
      const resolved = resolveMultiKey(key);

      // throw if it can't be resolved
      if (!resolved) throw errorInvalidKey(key);

      // update result
      createResult(
        resolved,
        true,
        result,
      );

    }

    // return result
    return result;

  };

}

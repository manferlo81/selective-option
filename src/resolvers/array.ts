import { createResult } from '../create-result';
import type { AllowNullish } from '../private-types';
import { errorInvalidKey } from '../tools/errors';
import { is, isArray } from '../tools/is';
import { resolveKey } from '../tools/key';
import type { KeyList, PotentialResolver, SpecialKeys } from './types';

export function createArrayResolver<K extends string, S extends string>(
  keys: KeyList<K>,
  special?: AllowNullish<SpecialKeys<S, K>>,
): PotentialResolver<K, boolean> {

  // return array resolver
  return (input) => {

    // exit if value is not an array
    if (!isArray(input)) return;

    return createResult(
      input.reduce<K[]>((output, key) => {

        // throw if item is not a string
        if (!is(key, 'string')) throw errorInvalidKey(key);

        // try to resolve as key or special key
        const resolved = resolveKey(key, keys, special);

        // throw if it can't be resolved
        if (!resolved) throw errorInvalidKey(key);

        // return updated result
        return [...output, ...resolved];

      }, []),
      true,
      createResult(
        keys,
        false,
      ),
    );

  };

}

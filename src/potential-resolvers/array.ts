import { createResult } from '../create-result';
import { errorInvalidKey } from '../errors';
import { is, isArray } from '../is';
import { AllowNullish } from '../private-types';
import { resolveKey } from './key';
import type { PotentialResolver, SpecialKeys } from './types';

export function createArrayResolver<K extends string, S extends string>(
  keys: readonly K[],
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

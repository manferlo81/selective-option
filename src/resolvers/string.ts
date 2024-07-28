import { createResult } from '../create-result';
import type { AllowNullish, KeyList, Nullish, SpecialKeys } from '../private-types';
import { resolveKeyIfValid } from '../tools/resolve-valid-key';
import type { PotentialResolver } from './types';

export function createStringResolver<K extends string, S extends string>(
  keys: KeyList<K>,
  special: SpecialKeys<S, K>,
): PotentialResolver<K, boolean>;

export function createStringResolver<K extends string>(
  keys: KeyList<K>,
  special?: Nullish,
): PotentialResolver<K, boolean>;

export function createStringResolver<K extends string, S extends string>(
  keys: KeyList<K>,
  special?: AllowNullish<SpecialKeys<S, K>>,
): PotentialResolver<K, boolean>;

export function createStringResolver<K extends string, S extends string>(
  keys: KeyList<K>,
  special?: AllowNullish<SpecialKeys<S, K>>,
): PotentialResolver<K, boolean> {

  // return string resolver
  return (input) => {

    // try to resolve value as key or special key
    const resolvedInput = resolveKeyIfValid(input, keys, special);

    // exit if it can't be resolved
    if (!resolvedInput) return;

    // get data from resolved input
    const [resolvedKeys, resolvedValue] = resolvedInput;

    // return result
    return createResult(
      resolvedKeys,
      resolvedValue,
      createResult(
        keys,
        !resolvedValue,
      ),
    );

  };

}

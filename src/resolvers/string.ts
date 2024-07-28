import { createResult } from '../create-result';
import type { AllowNullish, KeyList, Nullish, SpecialKeys } from '../private-types';
import { is } from '../tools/is';
import { resolveKey_v2 } from '../tools/key';
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

    // exit if value is not a string
    if (!is(input, 'string')) return;

    // try to resolve value as key or special key
    const resolved = resolveKey_v2(input, keys, special);

    // exit if it can't be resolved
    if (!resolved) return;

    const [resolved2, value] = resolved;

    // return result
    return createResult(
      resolved2,
      value,
      createResult(
        keys,
        !value,
      ),
    );

  };

}

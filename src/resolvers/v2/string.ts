import { createResult } from '../../create-result';
import { is } from '../../is';
import type { PotentialResolver } from '../../types';
import type { KeyResolver } from '../types';

export function createStringResolver_v2<K extends string>(
  keys: readonly K[],
  resolveKey: KeyResolver<K>,
): PotentialResolver<K, boolean> {

  // return string resolver
  return (input) => {

    // exit if value is not a string
    if (!is(input, 'string')) return;

    // try to resolve value as key or special key
    const resolved = resolveKey(input);

    // exit if it can't be resolved
    if (!resolved) return;

    // return result
    return createResult(
      resolved,
      true,
      createResult(
        keys,
        false,
      ),
    );

  };

}

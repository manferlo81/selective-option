import { createResult } from '../tools/create-result';
import { errorInvalidKey } from '../tools/errors';
import { isArray } from '../tools/is';
import { resolvePolarKey } from '../tools/resolve-polar-key';
import type { AllowNullish, Nullish, PolarKeyResolved } from '../types/private-types';
import type { KeyList, PotentialResolver, Resolved, SpecialKeys } from '../types/resolver-types';

function resolveKeyOrThrow<K extends string, S extends string>(key: unknown, keys: KeyList<K>, special?: AllowNullish<SpecialKeys<S, K>>): PolarKeyResolved<K> {

  // try to resolve key
  const resolvedKey = resolvePolarKey(key, keys, special);

  // throw if it can't be resolved
  if (!resolvedKey) throw errorInvalidKey(key);

  // return resolved key
  return resolvedKey;

}

export function createKeyListResolver<K extends string, S extends string>(
  keys: KeyList<K>,
  special: SpecialKeys<S, K>,
): PotentialResolver<K, boolean>;

export function createKeyListResolver<K extends string>(
  keys: KeyList<K>,
  special?: Nullish,
): PotentialResolver<K, boolean>;

export function createKeyListResolver<K extends string, S extends string>(
  keys: KeyList<K>,
  special?: AllowNullish<SpecialKeys<S, K>>,
): PotentialResolver<K, boolean>;

export function createKeyListResolver<K extends string, S extends string>(
  keys: KeyList<K>,
  special?: AllowNullish<SpecialKeys<S, K>>,
): PotentialResolver<K, boolean> {

  // return array resolver
  return (input) => {

    // exit if value is not an array
    if (!isArray(input)) return;

    // resolve to false if input array is empty
    if (input.length === 0) return createResult(
      keys,
      false,
    );

    // get first key independently from the rest
    const [first, ...rest] = input;

    // resolve first key
    const [firstKeys, firstPolarity] = resolveKeyOrThrow(first, keys, special);

    // create result based on first key
    const base = createResult(
      keys,
      !firstPolarity,
    );

    const override = createResult(
      firstKeys,
      firstPolarity,
    );

    const baseResult = { ...base, ...override };

    // extend base result according to the rest of the items
    return rest.reduce<Resolved<K, boolean>>((output, key) => {

      // resolve key
      const [resolvedKeys, resolvedPolarity] = resolveKeyOrThrow(key, keys, special);

      // return updated result
      const override = createResult(resolvedKeys, resolvedPolarity);
      return { ...output, ...override };

    }, baseResult);

  };

}

import { createResult } from '../create-result';
import type { AllowNullish, KeyList, Nullish, SpecialKeys } from '../private-types';
import { errorInvalidKey } from '../tools/errors';
import { isArray } from '../tools/is';
import { resolveKeyIfValid } from '../tools/resolve-valid-key';
import type { PotentialResolver, Resolved } from './types';

function resolveKeyOrThrow<K extends string, S extends string>(key: unknown, keys: KeyList<K>, special?: AllowNullish<SpecialKeys<S, K>>): [keys: K[], value: boolean] {

  const resolvedKey = resolveKeyIfValid(key, keys, special);

  // throw if it can't be resolved
  if (!resolvedKey) throw errorInvalidKey(key);

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

    if (input.length === 0) return createResult(
      keys,
      false,
    );

    const [first, ...rest] = input;
    const [firstKeys, firstValue] = resolveKeyOrThrow(first, keys, special);

    return rest.reduce<Resolved<K, boolean>>(
      (output, key) => {

        const [resolvedKeys, resolvedValue] = resolveKeyOrThrow(key, keys, special);

        // return updated result
        return createResult(
          resolvedKeys,
          resolvedValue,
          output,
        );
      },
      createResult(
        firstKeys,
        firstValue,
        createResult(
          keys,
          !firstValue,
        ),
      ),
    );

  };

}

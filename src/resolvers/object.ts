import { createResult } from '../create-result';
import { errorInvalidKey, errorInvalidValue } from '../errors';
import type { AllowNullish, TypeCheckFunction } from '../helper-types';
import { is, isArray } from '../is';
import type { PotentialResolver } from '../types';
import { createKeyResolver, createSpecialKeyResolver } from './key';
import type { KeyResolver } from './types';

export function createObjectResolver_v2<K extends string, V, D = V>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  resolveKey: KeyResolver<K>,
  resolveSpecialKey: KeyResolver<K>,
  defaultKey: string = 'default',
): PotentialResolver<K, V | D> {

  return (input) => {

    // exit if it's not an object
    if (!input || !is(input, 'object') || isArray(input)) return;

    const objectKeys = Object.keys(input);

    let overrideValue = defaultValue;
    const specialData: Array<[K[], V]> = [];
    const keysData: Array<[K[], V]> = [];

    // const len = objectKeys.length;
    for (const key of objectKeys) {

      // const key = objectKeys[i];
      const value = input[key as never];

      if (value != null) {

        if (!isValidValue(value)) throw errorInvalidValue(value);

        if (key === defaultKey) {
          overrideValue = value;
        } else {
          const keyResolved = resolveKey(key);
          if (keyResolved) {
            keysData.push([keyResolved, value]);
          } else {
            const specialResolved = resolveSpecialKey(key);
            if (specialResolved) {
              specialData.push([specialResolved, value]);
            } else {
              throw errorInvalidKey(key);
            }
          }
        }

      }

    }

    const result = createResult<K, V | D>(
      keys,
      overrideValue,
    );

    for (const item of specialData) {
      createResult(
        item[0],
        item[1],
        result,
      );
    }

    for (const item of keysData) {
      createResult(
        item[0],
        item[1],
        result,
      );
    }

    return result;

  };

}

export function createObjectResolver<K extends string, V, D = V>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<Record<string, K[]>>,
  defaultKey?: string,
): PotentialResolver<K, V | D> {
  const resolveKey = createKeyResolver(isKey);
  const resolveSpecialKey = createSpecialKeyResolver(isKey, special);
  return createObjectResolver_v2(
    keys,
    isValidValue,
    defaultValue,
    resolveKey,
    resolveSpecialKey,
    defaultKey,
  );

}

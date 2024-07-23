import { createResult } from '../../create-result';
import { errorInvalidKey, errorInvalidValue } from '../../errors';
import type { TypeCheckFunction } from '../../helper-types';
import { is, isArray } from '../../is';
import type { PotentialResolver } from '../../types';
import type { KeyResolver } from '../types';

export function createObjectResolver_v2<K extends string, V, D = V>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  resolveKey: KeyResolver<K>,
  resolveSpecialKey: KeyResolver<K>,
  defaultKey: string = 'default',
): PotentialResolver<K, V | D> {

  // return object resolver
  return (input) => {

    // exit if it's not an object
    if (!input || !is<Record<string, V> | null | unknown[]>(input, 'object') || isArray(input)) return;

    const objectKeys = Object.keys(input);

    let overrideValue: V | D = defaultValue;
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

    const defaultResult = createResult<K, V | D>(
      keys,
      overrideValue,
    );

    const specialResult = specialData.reduce((output, [keys, value]) => {
      return createResult(
        keys,
        value, output,
      );
    }, defaultResult);

    const regularResult = keysData.reduce((output, [keys, value]) => {
      return createResult(
        keys,
        value,
        output,
      );
    }, specialResult);

    return regularResult;

  };

}

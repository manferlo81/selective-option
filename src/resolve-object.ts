import { createResult } from './create-result';
import { errorInvalidKey, errorInvalidValue } from './errors';
import { isArray } from './type-check';
import type { Nullable, PotentialResolver, TypeCheckFunction } from './types';

export function createObjectResolver<K extends string, V, D = V, DK extends string = 'default'>(
  keys: K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
  defaultKey2?: DK,
): PotentialResolver<K, V | D> {
  return (object) => {
    if (typeof object === 'object' && object && !isArray(object)) {

      const objectKeys = Object.keys(object);

      let overrideValue: [V] | undefined;
      let specialData: Array<[K[], V]> | undefined;
      let keysData: Array<[K, V]> | undefined;

      const len = objectKeys.length;
      for (let i = 0; i < len; i++) {

        const key = objectKeys[i];
        const value = object[key as never];

        if (value != null) {

          if (!isValidValue(value)) {
            throw errorInvalidValue(value);
          }

          const defaultKey = defaultKey2 || 'default';

          if (key === defaultKey) {
            overrideValue = [value];
          } else {
            const specialKeys: Nullable<K[]> = special && special[key];
            if (specialKeys) {
              (specialData || (specialData = [])).push([specialKeys, value]);
            } else if (isKey(key)) {
              (keysData || (keysData = [])).push([key, value]);
            } else {
              throw errorInvalidKey(key);
            }
          }

        }

      }

      const result = createResult(
        keys,
        overrideValue ? overrideValue[0] : defaultValue,
      );

      if (specialData) {
        const slen = specialData.length;
        for (let s = 0; s < slen; s++) {
          createResult(
            specialData[s][0],
            specialData[s][1],
            result,
          );
        }
      }

      if (keysData) {
        const klen = keysData.length;
        for (let k = 0; k < klen; k++) {
          result[keysData[k][0]] = keysData[k][1];
        }
      }

      return result;

    }
  };
}

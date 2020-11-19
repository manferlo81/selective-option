import { createResult } from './create-result';
import { isArray } from './type-check';
import type { Nullable, ResolveObjectOptions, SelectiveResolved } from './types';

export function resolveObject<K extends string, V, D = V>(
  object: unknown,
  options: ResolveObjectOptions<K, V, D>,
): SelectiveResolved<K, V | D> | void {

  const { keys, isKey, special, isValidValue, defaultValue } = options;

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
          throw new Error(`${value} is not a valid value`);
        }

        if (key === 'default') {
          overrideValue = [value];
        } else {
          const specialKeys: Nullable<K[]> = special && special[key];
          if (specialKeys) {
            (specialData || (specialData = [])).push([specialKeys, value]);
          } else if (isKey(key)) {
            (keysData || (keysData = [])).push([key, value]);
          } else {
            throw new Error(`"${key}" is not a valid key`);
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

}
